const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const { CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE } = require('shared/constants/chainBridge');
const { GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE } = require('shared/constants/gncBridge');
const { TOKEN_ADDRESS, TOKEN_ABI } = require('shared/constants/token');
const { GNC, CHAIN, ENV } = require('shared/constants/env');

const { getNetworkConfigForBot } = require('shared/networks');

const GNC_URL = getNetworkConfigForBot(GNC).rpcUrls[0];
const CHAIN_URL = getNetworkConfigForBot(CHAIN).rpcUrls[0];

const PENDING_LIMIT = 5;

async function main() {
    console.log(`#### ${ENV} #### Processing bridge transactions...`);

    const gncProvider = new ethers.JsonRpcProvider(GNC_URL);
    const chainProvider = new ethers.JsonRpcProvider(CHAIN_URL);

    const gncBridgeContract = new ethers.Contract(GNC_BRIDGE_ADDRESS, GNC_ABI_BRIDGE, gncProvider);
    const chainBridgeContract = new ethers.Contract(CHAIN_BRIDGE_ADDRESS, CHAIN_ABI_BRIDGE, chainProvider);

    const chainSigner = new ethers.Wallet(process.env.privateKey, chainProvider);
    const gncSigner = new ethers.Wallet(process.env.privateKey, gncProvider);

    const gncBridgeWithSigner = gncBridgeContract.connect(gncSigner);
    const chainBridgeWithSigner = chainBridgeContract.connect(chainSigner);

    logBalances(chainProvider, chainSigner, gncProvider, gncSigner);

    async function releaseOnGNC(destinyContractWithSigner, by, amount, transferId) {
        return destinyContractWithSigner.release(TOKEN_ADDRESS, by, amount, transferId);
    }

    async function releaseOnChain(destinyContractWithSigner, by, amount, transferId) {
        return destinyContractWithSigner.release(by, amount, transferId, { value: amount });
    }

    async function processInLoop() {
        while (true) {
            const startTime1 = new Date();
            console.log(`${startTime1.toISOString()}:Starting processDeposits for GNC`);
    
            await processDeposits(
                gncBridgeContract,
                gncBridgeWithSigner,
                chainBridgeWithSigner,
                releaseOnGNC
            );
    
            const endTime1 = new Date();
            console.log(`${endTime1.toISOString()}: Finished processDeposits for GNC`);
    
            const startTime2 = new Date();
            console.log(`${startTime2.toISOString()}: Starting processDeposits for Chain`);
    
            await processDeposits(
                chainBridgeContract,
                chainBridgeWithSigner,
                gncBridgeWithSigner,
                releaseOnChain
            );
    
            const endTime2 = new Date();
            console.log(`${endTime2.toISOString()}: Finished processDeposits for Chain `);
    
            // Delay for 30 seconds
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
    
    processInLoop();
    

}

async function logBalances(chainProvider, chainSigner, gncProvider, gncSigner) {
    console.log(`CHAIN => contract: ${CHAIN_BRIDGE_ADDRESS} Provider: ${CHAIN_URL}`);
    console.log(`GNC => contract: ${GNC_BRIDGE_ADDRESS} Provider: ${GNC_URL}`);

    const chainBalance = await chainProvider.getBalance(chainSigner.address);
    console.log(`CHAIN => Balance: ${chainBalance} ETH`);

    const gncBalance = await gncProvider.getBalance(gncSigner.address);    
    console.log(`GNC => Balance: ${gncBalance} ETH`);
}

async function logPendingDeposits(bridgContract) {
    const pendingTransfers = await bridgContract.getDeposits();
    console.log(`Pending deposits: ${pendingTransfers.length}`);
    pendingTransfers.forEach((deposit, index) => {
        console.log(`Deposit #${index + 1}: By Address: ${deposit[0]}  Amount: ${hre.ethers.formatEther(deposit[1])} GNC  Transfer ID: ${deposit[2]}`);
    });
}

async function processDeposits(
    pendingOriginContract,
    pendingOriginContractWithSigner,
    destinyContractWithSigner,
    releaseFunc
  ) {
    console.log(`Processing deposits from ${pendingOriginContract.address} blockchain`);
  
    const pendingTransfers = await pendingOriginContract.getDeposits();
  
    console.log(`Processing ${pendingTransfers.length} deposits`);
  
    const completedTransferIds = [];
    let processedCount = 0; // Counter to track the number of processed entries
  
    for (const transfer of pendingTransfers) {
      if (processedCount >= PENDING_LIMIT) break; // Exit the loop after processing 5 entries
  
      const by = transfer[0];
      const amount = transfer[1];
      const transferId = transfer[2];
  
      try {
        const isCompleted = await destinyContractWithSigner.completedTransfers(transferId);
        if (isCompleted) {
          console.log(`Transfer ${transferId} already completed`);
          completedTransferIds.push(transferId);
          continue;
        }
  
        const tx = await releaseFunc(destinyContractWithSigner, by, amount, transferId);
        await tx.wait();
        console.log(`Released ${amount.toString()} to ${by}`);
  
        completedTransferIds.push(transferId);
        processedCount++; // Increment the counter after processing an entry
      } catch (error) {
        console.error(`Error processing deposit: ${error}`);
      }
    }
  
    // Remove completed transfers from pending
    if (completedTransferIds.length > 0) {
      await pendingOriginContractWithSigner.removePending(completedTransferIds);
      console.log(`Removed ${completedTransferIds.length} completed transfers from pending`);
    }
    await logPendingDeposits(pendingOriginContract);
  }


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});