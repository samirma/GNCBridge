// scripts/getChainInfo.js
async function getChainInfo() {
    const { ethers } = require("hardhat");
    const network = await ethers.provider.getNetwork();
    const chainId = `0x${network.chainId.toString(16)}`;
    const chainName = network.name;
    const rpcUrl = "lala";
    const blockExplorerUrl = `https://${network.name}.etherscan.io`;
  
    const chainInfo = {
      chainId: chainId,
      chainName: chainName.charAt(0).toUpperCase() + chainName.slice(1) + " Network",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: [rpcUrl],
      blockExplorerUrls: [blockExplorerUrl]
    };
  
    console.log(JSON.stringify(chainInfo, null, 2));
  }
  
  getChainInfo();
  