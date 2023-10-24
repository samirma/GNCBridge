const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

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
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
