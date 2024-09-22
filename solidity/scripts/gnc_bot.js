const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const { CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE } = require('../my-app/constants/chainBridge');
const { GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE } = require('../my-app/constants/gncBridge');
const { TOKEN_ADDRESS, TOKEN_ABI } = require('../my-app/constants/token');

const { getChainNetwork, getGNCNetwork } = require('../my-app/constants/networks');


async function main() {
    const GNC_URL = getGNCNetwork().rpcUrls[0];
    const CHAIN_URL = getChainNetwork().rpcUrls[0];

    // Provider for GNC blockchain
    const gncProvider = new ethers.providers.JsonRpcProvider(GNC_URL);
    // Provider for CHAIN blockchain
    const chainProvider = new ethers.providers.JsonRpcProvider(CHAIN_URL);

    // Contract instance for GNC bridge contract
    const gncBridgeContract = new ethers.Contract(GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE, gncProvider);

    // Contract instance for CHAIN bridge contract
    const chainBridgeContract = new ethers.Contract(CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE, chainProvider);

    console.log(`Listen for Deposit events on GNC blockchain`);
    chainBridgeContract.on("Deposit", async (by, amount) => {
        console.log(`Deposit event detected on GNC blockchain: ${by} deposited ${amount.toString()}`);

        // Connect to the CHAIN bridge contract with a signer
        const signer = new ethers.Wallet(process.env.privateKey, chainProvider);
        const gncBridgeContract = chainBridgeContract.connect(signer);

        // Call completeBridge function on CHAIN blockchain
        const tokenAddress = TOKEN_ADDRESS;
        await gncBridgeContract.transferToken(tokenAddress, by, amount);
        console.log(`transferToken called on CHAIN blockchain for ${by} with amount ${amount.toString()}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});