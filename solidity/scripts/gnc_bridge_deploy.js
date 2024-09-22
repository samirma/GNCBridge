const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  
  const [deployer] = await hre.ethers.getSigners();

  console.log(
      "Deploying contracts with the account:",
      deployer.address
  );
  const lock = await hre.ethers.deployContract("GncBridge", [deployer.address]);

  await lock.waitForDeployment();

  console.log(`GncBridge deployed to ${lock.target}`  );

  const contractsDir = path.join(__dirname, '..', '..', 'shared', 'constants');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, 'gncBridge.js'),
    `export const GNC_BRIDGE_ADDRESS = "${lock.target}";\n` +
    `export const GNC_ABI_BRIDGE = ${JSON.stringify(lock.interface.format('json'), null, 2)};\n`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
