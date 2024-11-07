const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    await helpers.setBalance(deployer.address, 3000 * 1e18);

    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy();

    const deployerTokenBalance = await token.balanceOf(deployer.address);

    const tokenDecimals = await token.decimals();

    console.log("Token contract deployed to:", token.target);
    console.log("Deployer Address:", deployer.address);
    console.log("Deployer ETH balance:", (await deployer.provider.getBalance(deployer.address)).toString());
    console.log("Deployer Token Balance:", hre.ethers.formatUnits(deployerTokenBalance, tokenDecimals));

    const contractsDir = path.join(__dirname, '..', '..', 'shared', 'constants');
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      path.join(contractsDir, 'token.js'),
      `export const TOKEN_ADDRESS = "${token.target}";\n` +
      `export const TOKEN_ABI = ${JSON.stringify(token.interface.format('json'), null, 2)};\n`
    );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
