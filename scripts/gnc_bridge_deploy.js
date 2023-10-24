const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  
  let addressWallet = "0x125089C0403C4Cd3a01c18e6FE1D46Ab9bB34344";
  const lock = await hre.ethers.deployContract("GncBridge", [addressWallet]);

  await lock.waitForDeployment();

  console.log(`GncBridge deployed to ${lock.target}`  );

  const contractsDir = path.join(__dirname, '..', 'my-app', 'constants');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, 'gncBridge.js'),
    `export const BRIDGE_ADDRESS = "${lock.target}";\n` +
    `export const ABI_BRIDGE = ${JSON.stringify(lock.interface.format('json'), null, 2)};\n`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
