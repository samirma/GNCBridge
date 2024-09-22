const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    await helpers.setBalance(deployer.address, 3000 * 1e18);

    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy(deployer.address);

    const test = await token.waitForDeployment();

    console.log("Token contract deployed to:", token.target);

    const contractsDir = path.join(__dirname, '..', '..', 'shared', 'constants');
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, 'token.js'),
      `export const TOKEN_ADDRESS = "${test.target}";\n` +
      `export const TOKEN_ABI = ${JSON.stringify(test.interface.format('json'), null, 2)};\n`
    );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
