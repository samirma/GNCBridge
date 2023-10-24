const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    let addressWallet = "0x125089C0403C4Cd3a01c18e6FE1D46Ab9bB34344"
    let addressDeployer = deployer.address

    let address = addressWallet

    console.log(
        "Deploying contracts with the account:",
        address
    );

    await helpers.setBalance(address, 3000 * 1e18);

    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
