const hre = require("hardhat");
const fs = require('fs');
const path = require('path');
const ethers = require('ethers'); 

async function main() {

  const [deployer] = await hre.ethers.getSigners();

  console.log(
      "Deploying contracts with the account:",
      deployer.address
  );

  const initialFee = hre.ethers.parseEther("0.01");
  const ChainBridge = await hre.ethers.getContractFactory("ChainBridge");
  const chainBridge = await ChainBridge.deploy(deployer.address, initialFee);

  //const tokenAddress = "0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c";
  //await chainBridge.setToken(tokenAddress);

  console.log(`ChainBridge deployed to ${chainBridge.target}`);

  const contractsDir = path.join(__dirname, '..', '..', 'shared', 'constants');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, 'chainBridge.js'),
    `export const CHAIN_BRIDGE_ADDRESS = "${chainBridge.target}";\n` +
    `export const CHAIN_ABI_BRIDGE = ${JSON.stringify(chainBridge.interface.format('json'), null, 2)};\n` 

  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
