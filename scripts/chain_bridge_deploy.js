const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const ChainBridge = await hre.ethers.getContractFactory("ChainBridge");
  const chainBridge = await ChainBridge.deploy();
  await chainBridge.deployTransaction.wait(); // wait for the transaction to be mined

  console.log(`ChainBridge deployed to ${chainBridge.address}`);

  const contractsDir = path.join(__dirname, '..', 'my-app', 'constants');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, 'index.js'),
    `export const BRIDGE_ADDRESS = "${chainBridge.address}";\n` +
    `export const ABI_BRIDGE = ${JSON.stringify(ChainBridge.interface.format('json'), null, 2)};\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
