const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const chainBridge = await hre.ethers.deployContract("ChainBridge");

  await chainBridge.waitForDeployment();

  console.log(`ChainBridge deployed to ${chainBridge.address}`);

  const contractsDir = path.join(__dirname, '..', 'my-app', 'constants');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, 'chainBridge.js'),
    `export const BRIDGE_ADDRESS = "${chainBridge.target}";\n` +
    `export const ABI_BRIDGE = ${JSON.stringify(chainBridge.interface.format('json'), null, 2)};\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
