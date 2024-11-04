// Import required dependencies
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainBridge Contract", function () {
    let ChainBridge;
    let chainBridge;
    let owner;
    let user1;
    let user2;
    let token;

    const TOKEN_NAME = "TestToken";
    const TOKEN_SYMBOL = "TTK";
    const INITIAL_SUPPLY = ethers.utils.parseEther("1000"); // Using ethers.utils.parseEther

    beforeEach(async function () {
        // Get the signers
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy a mock ERC20 token
        const Token = await ethers.getContractFactory("ERC20");
        token = await Token.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
        await token.deployed();

        // Deploy the ChainBridge contract
        ChainBridge = await ethers.getContractFactory("ChainBridge");
        chainBridge = await ChainBridge.deploy(owner.address);
        await chainBridge.deployed();

        // Transfer some tokens to user1 and approve ChainBridge for spending
        await token.connect(owner).transfer(user1.address, ethers.utils.parseEther("100")); // Using ethers.utils.parseEther
        await token.connect(user1).approve(chainBridge.address, ethers.utils.parseEther("100")); // Using ethers.utils.parseEther
    });

    describe("Deposit Function", function () {
        it("should allow a user to deposit tokens", async function () {
            const amount = ethers.utils.parseEther("50"); // Using ethers.utils.parseEther
            await expect(chainBridge.connect(user1).deposit(token.address, amount))
                .to.emit(chainBridge, "Deposit")
                .withArgs(user1.address, amount, await chainBridge.completedTransfers(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [user1.address, amount]))));
            
            expect(await token.balanceOf(chainBridge.address)).to.equal(amount);
        });

        it("should revert if user does not have enough balance", async function () {
            const amount = ethers.utils.parseEther("200"); // More than user1's balance
            await expect(chainBridge.connect(user1).deposit(token.address, amount)).to.be.revertedWith("Not enough balance");
        });

        it("should revert if the allowance is not enough", async function () {
            const amount = ethers.utils.parseEther("50");
            await token.connect(user1).approve(chainBridge.address, ethers.utils.parseEther("25")); // Not enough allowance
            await expect(chainBridge.connect(user1).deposit(token.address, amount)).to.be.revertedWith("Check the token allowance");
        });

        it("should revert if the transfer has already been completed", async function () {
            const amount = ethers.utils.parseEther("50");
            await chainBridge.connect(user1).deposit(token.address, amount); // First deposit
            await expect(chainBridge.connect(user1).deposit(token.address, amount)).to.be.revertedWith("Transfer already completed");
        });
    });

    describe("Release Function", function () {
        it("should allow the owner to release tokens", async function () {
            const amount = ethers.utils.parseEther("50");
            const transferId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [user1.address, amount]));
            await chainBridge.connect(user1).deposit(token.address, amount); // User deposits tokens
            
            await expect(chainBridge.release(token.address, user1.address, amount, transferId))
                .to.emit(chainBridge, "TransferCompleted")
                .withArgs(user1.address, transferId, amount);

            expect(await token.balanceOf(user1.address)).to.equal(amount);
            expect(await token.balanceOf(chainBridge.address)).to.equal(0);
        });

        it("should revert if the transfer has already been completed", async function () {
            const amount = ethers.utils.parseEther("50");
            const transferId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [user1.address, amount]));
            await chainBridge.connect(user1).deposit(token.address, amount); // User deposits tokens
            await chainBridge.release(token.address, user1.address, amount, transferId); // Release tokens
            
            await expect(chainBridge.release(token.address, user1.address, amount, transferId)).to.be.revertedWith("Transfer already completed");
        });

        it("should revert if the contract does not have enough balance", async function () {
            const amount = ethers.utils.parseEther("50");
            const transferId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [user1.address, amount]));
            await chainBridge.connect(user1).deposit(token.address, amount); // User deposits tokens
            
            await chainBridge.release(token.address, user1.address, amount, transferId); // Release tokens

            // Attempt to release more tokens than available
            await expect(chainBridge.release(token.address, user2.address, amount, transferId)).to.be.revertedWith("Not enough balance in contract");
        });
    });

    describe("Withdraw Function", function () {
        it("should allow the owner to withdraw ETH", async function () {
            // Assuming we can send ETH to the contract
            await owner.sendTransaction({
                to: chainBridge.address,
                value: ethers.utils.parseEther("1"),
            });

            const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
            await chainBridge.withdraw(ethers.utils.parseEther("1"));

            const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
            expect(finalOwnerBalance).to.be.gt(initialOwnerBalance); // Owner's balance should increase
        });

        it("should revert if the owner tries to withdraw more than available", async function () {
            await expect(chainBridge.withdraw(ethers.utils.parseEther("1"))).to.be.revertedWith("Insufficient balance");
        });
    });

    describe("Withdraw Tokens Function", function () {
        it("should allow the owner to withdraw tokens", async function () {
            const amount = ethers.utils.parseEther("50");
            await chainBridge.connect(user1).deposit(token.address, amount); // User deposits tokens
            
            await chainBridge.withdrawTokens(token.address, amount); // Owner should be able to withdraw tokens

            expect(await token.balanceOf(owner.address)).to.equal(amount);
            expect(await token.balanceOf(chainBridge.address)).to.equal(0);
        });

        it("should revert if the owner tries to withdraw more tokens than available", async function () {
            await expect(chainBridge.withdrawTokens(token.address, ethers.utils.parseEther("100"))).to.be.revertedWith("Insufficient token balance");
        });
    });

    describe("Pausable Functions", function () {
        it("should allow the owner to pause the contract", async function () {
            await chainBridge.pause();
            expect(await chainBridge.paused()).to.be.true;
        });

        it("should revert deposit when paused", async function () {
            await chainBridge.pause();
            await expect(chainBridge.connect(user1).deposit(token.address, ethers.utils.parseEther("50"))).to.be.revertedWith("Pausable: paused");
        });

        it("should revert release when paused", async function () {
            await chainBridge.pause();
            const transferId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [user1.address, ethers.utils.parseEther("50")]));
            await expect(chainBridge.release(token.address, user1.address, ethers.utils.parseEther("50"), transferId)).to.be.revertedWith("Pausable: paused");
        });

        it("should allow the owner to unpause the contract", async function () {
            await chainBridge.pause();
            await chainBridge.unpause();
            expect(await chainBridge.paused()).to.be.false;
        });
    });
});