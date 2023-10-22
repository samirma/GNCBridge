const helpers = require("@nomicfoundation/hardhat-network-helpers");


const init = async () => {
    const address = "0x125089C0403C4Cd3a01c18e6FE1D46Ab9bB34344";

    //console.log(`Balance after: ${(await provider.getBalance(destinationAddress))}`);

    await helpers.setBalance(address, 1000 * 1e18);

    //console.log(`Balance set on ${address}`);

    //console.log(`Balance after: ${(await provider.getBalance(destinationAddress))}`);
};

init()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });