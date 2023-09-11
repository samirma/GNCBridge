require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
    const privateKey = "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0";
    const destinationAddress = "0x125089C0403C4Cd3a01c18e6FE1D46Ab9bB34344";

    const wallet = new ethers.Wallet(privateKey, ethers.provider);
    const balance = await wallet.getBalance();

    const gasPrice = await ethers.provider.getGasPrice();
    const gasLimit = 21000;  // standard gas limit for transfers

    const maxFee = gasPrice.mul(gasLimit);
    const amountToSend = balance.mul(80).div(100).sub(maxFee);

    if (amountToSend.lte(0)) {
        console.log("Insufficient balance to perform the transaction.");
        return;
    }

    const transactionResponse = await wallet.sendTransaction({
        to: destinationAddress,
        value: amountToSend,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
    });

    console.log("Transaction hash:", transactionResponse.hash);

    await transactionResponse.wait();

    console.log(`Transferred ${ethers.utils.formatEther(amountToSend)} ETH to ${destinationAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
