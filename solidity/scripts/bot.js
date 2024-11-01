const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const { CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE } = require('shared/constants/chainBridge');
const { GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE } = require('shared/constants/gncBridge');
const { TOKEN_ADDRESS, TOKEN_ABI } = require('shared/constants/token');
const { GNC, CHAIN, ENV } = require('shared/constants/env');

const { getNetworkConfig } = require('shared/networks');

const GNC_URL = getNetworkConfig(GNC).rpcUrls[0];
const CHAIN_URL = getNetworkConfig(CHAIN).rpcUrls[0];

async function main() {
    console.log(`#### ${ENV} #### Listening for bridge events...`);

    const gncProvider = new ethers.JsonRpcProvider(GNC_URL);
    const chainProvider = new ethers.JsonRpcProvider(CHAIN_URL);

    const gncBridgeContract = new ethers.Contract(GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE, gncProvider);
    const chainBridgeContract = new ethers.Contract(CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE, chainProvider);

    const chainSigner = new ethers.Wallet(process.env.privateKey, chainProvider);
    const gncSigner = new ethers.Wallet(process.env.privateKey, gncProvider);

    const gncBridgeWithSigner = gncBridgeContract.connect(gncSigner);
    const chainBridgeWithSigner = chainBridgeContract.connect(chainSigner);

    logBalances(chainProvider, chainSigner, gncProvider, gncSigner);

    listenForGncDeposits(gncBridgeContract, chainBridgeContract, chainBridgeWithSigner);

    listenForChainDeposits(chainBridgeContract, gncBridgeContract, gncBridgeWithSigner);

}

async function logBalances(chainProvider, chainSigner, gncProvider, gncSigner) {
    console.log(`CHAIN => contract: ${CHAIN_BRIDGE_ADDRESS} Provider: ${CHAIN_URL}`);
    console.log(`GNC => contract: ${GNC_BRIDGE_ADDRESS} Provider: ${GNC_URL}`);

    const chainBalance = await chainProvider.getBalance(chainSigner.address);
    console.log(`CHAIN => Balance: ${chainBalance} ETH`);

    const gncBalance = await gncProvider.getBalance(gncSigner.address);    
    console.log(`GNC => Balance: ${gncBalance} ETH`);
}

function listenForGncDeposits(gncBridgeContract, chainBridgeContract, chainBridgeWithSigner) {
    console.log(`Listen for deposits on GNC blockchain`);
    gncBridgeContract.on("Deposit", async (by, amount, transferId) => {
        try {
            console.log(`Deposit detected on GNC: ${by} deposited ${amount.toString()}`);
            
            // Verify if transfer is already completed on Chain
            const isCompleted = await chainBridgeContract.completedTransfers(transferId);
            if (isCompleted) {
                console.log(`Transfer ${transferId} already completed on Chain`);
                return;
            }

            // Release tokens on Chain
            const tx = await chainBridgeWithSigner.release(TOKEN_ADDRESS, by, amount, transferId);
            await tx.wait();
            console.log(`Released ${amount.toString()} tokens to ${by} on Chain`);
        } catch (error) {
            console.error(`Error processing GNC deposit: ${error}`);
        }
    });
}

function listenForChainDeposits(chainBridgeContract, gncBridgeContract, gncBridgeWithSigner) {
    console.log(`Listen for deposits on Chain blockchain`);
    chainBridgeContract.on("Deposit", async (by, amount, transferId) => {
        try {
            console.log(`Deposit detected on Chain: ${by} deposited ${amount.toString()}`);
            
            // Verify if transfer is already completed on GNC
            const isCompleted = await gncBridgeContract.completedTransfers(transferId);
            if (isCompleted) {
                console.log(`Transfer ${transferId} already completed on GNC`);
                return;
            }

            // Release native currency on GNC
            const tx = await gncBridgeWithSigner.release(by, amount, transferId, { value: amount });
            await tx.wait();
            console.log(`Released ${amount.toString()} native currency to ${by} on GNC`);
        } catch (error) {
            console.error(`Error processing Chain deposit: ${error}`);
        }
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});