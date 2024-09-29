const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const { CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE } = require('shared/constants/chainBridge');
const { GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE } = require('shared/constants/gncBridge');
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

    console.log(`Waiting for Deposit events on GNC blockchain`);
    chainBridgeContract.on("Deposit", async (by, amount) => {
        try {
            console.log(`Deposit event detected on GNC blockchain: ${by} deposited ${amount.toString()}`);

            // Connect to the CHAIN bridge contract with a signer
            const signer = new ethers.Wallet(process.env.privateKey, gncProvider);

            // Transfer the amount from the wallet to the `by` address
            const tx = await signer.sendTransaction({
                to: by,
                value: amount
            });
            await tx.wait();
            console.log(`Transferred ${amount.toString()} to ${by}`);
        } catch (error) {
            console.error(`Error handling Deposit event: ${error}`);
        }
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
