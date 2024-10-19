const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const { CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE } = require('shared/constants/chainBridge');
const { GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE } = require('shared/constants/gncBridge');
const { TOKEN_ADDRESS, TOKEN_ABI } = require('shared/constants/token');
const { GNC, CHAIN } = require('shared/constants/env');

const { getNetworkConfig } = require('shared/constants/networks');

const GNC_URL = getNetworkConfig(GNC).rpcUrls[0];
const CHAIN_URL = getNetworkConfig(CHAIN).rpcUrls[0];

async function main() {
    
    // Provider for GNC blockchain
    console.log(`Creating GNC provider to url: ` + GNC_URL);
    const gncProvider = new ethers.JsonRpcProvider(GNC_URL);
    // Provider for CHAIN blockchain
    console.log(`Creating chain provider to url: ` + CHAIN_URL);
    const chainProvider = new ethers.JsonRpcProvider(CHAIN_URL);

    // Contract instance for GNC bridge contract
    const gncBridgeContract = new ethers.Contract(GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE, gncProvider);

    // Contract instance for CHAIN bridge contract
    const chainBridgeContract = new ethers.Contract(CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE, chainProvider);

    // Connect to the CHAIN bridge contract with a signer
    const chainsigner = new ethers.Wallet(process.env.privateKey, chainProvider);
    const chainBridgeWithSigner = chainBridgeContract.connect(chainsigner);

    // Connect to the CHAIN bridge contract with a signer
    const gncSigner = new ethers.Wallet(process.env.privateKey, gncProvider);

    console.log(`Waiting for Deposit events on GNC blockchain`);
    gncBridgeContract.on("Deposit", async (by, amount) => {
        try {
            console.log(`Deposit event detected on GNC blockchain: ${by} deposited ${amount.toString()}`);
    
            // Call completeBridge function on CHAIN blockchain
            await chainBridgeWithSigner.transferToken(TOKEN_ADDRESS, by, amount);
            console.log(`transferToken called on CHAIN blockchain for ${by} with amount ${amount.toString()}`);
        } catch (error) {
            console.error(`Error handling Deposit event on GNC: ${error}`);
        }
    });

    console.log(`Waiting for Deposit events on CHAIN blockchain`);
    chainBridgeContract.on("Deposit", async (by, amount) => {
        try {
            console.log(`Deposit event detected on CHAIN blockchain: ${by} deposited ${amount.toString()}`);

            // Transfer the amount from the wallet to the `by` address
            const tx = await gncSigner.sendTransaction({
                to: by,
                value: amount
            });
            await tx.wait();
            console.log(`Transferred ${amount.toString()} to ${by}`);
        } catch (error) {
            console.error(`Error handling Deposit event on CHAIN: ${error}`);
        }
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});