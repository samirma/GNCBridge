const helpers = require("@nomicfoundation/hardhat-network-helpers");


async function main() {
    const privateKey = "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0";
    const destinationAddress = "0x125089C0403C4Cd3a01c18e6FE1D46Ab9bB34344";

    await helpers.setBalance(destinationAddress, 100n ** 18n);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
