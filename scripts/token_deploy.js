const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());


    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy(deployer.address);

    await token.deployed();

    console.log("Token contract deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
