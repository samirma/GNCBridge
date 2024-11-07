const { expect } = require("chai");
const hre = require("hardhat");


describe("ChainBridge", function () {
  let ChainBridge, chainBridge, owner, addr1, addr2, token;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Mint tokens for testing
    await token.connect(owner).mint(hre.ethers.parseEther("100"));
    await token.connect(addr1).mint(hre.ethers.parseEther("100"));
    await token.connect(addr2).mint(hre.ethers.parseEther("100"));

    // Deploy the ChainBridge contract
    ChainBridge = await ethers.getContractFactory("ChainBridge");
    chainBridge = await ChainBridge.deploy(owner.address, hre.ethers.parseEther("0.01"));
    await chainBridge.waitForDeployment();
    
    const amount = hre.ethers.parseUnits("100", 18);
    //await token.connect(addr1).approve(chainBridge.target, amount);

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await chainBridge.owner()).to.equal(owner.address);
    });

    it("Should set the initial fee", async function () {
      expect(await chainBridge.fee()).to.equal(hre.ethers.parseEther("0.01"));
    });
  });

  describe("Transactions", function () {
    // it("Should deposit tokens and emit an event", async function () {
    //   const amount = hre.ethers.parseUnits("100", 18);
    //   await token.connect(addr1).approve(chainBridge.target, amount);
      
    //   const fee = hre.ethers.parseEther("0.01");

    //   await expect(() => 
    //     chainBridge.connect(addr1).deposit(token.target, amount, { value: fee })
    //   ).to.changeTokenBalances(token, [addr1, chainBridge], [-amount, amount]);

    //   const transferId = hre.ethers.utils.keccak256(
    //     hre.ethers.utils.defaultAbiCoder.encode(
    //       ["address", "uint256", "uint256"],
    //       [addr1.address, (await hre.ethers.provider.getBlock("latest")).timestamp, amount]
    //     )
    //   );

    //   expect(await chainBridge.completedTransfers(transferId)).to.be.true;

    //   await expect(
    //     chainBridge.connect(addr1).deposit(token.target, amount, { value: fee })
    //   ).to.emit(chainBridge, "Deposit").withArgs(addr1.address, amount, transferId);
    // });

    it("Should release tokens and emit an event", async function () {
      const amount = hre.ethers.parseUnits("50", 18);
      const fee = hre.ethers.parseEther("0.01");

      await token.connect(addr1).approve(chainBridge.target, amount);
      await chainBridge.connect(addr1).deposit(token.target, amount, { value: fee });

      ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [addr1.address, (await hre.ethers.provider.getBlock("latest")).timestamp, amount]
      )

      const lala = hre.ethers.defaultAbiCoder.en(
        ["address", "uint256", "uint256"], 
        [addr1.address, (await hre.ethers.provider.getBlock("latest")).timestamp, amount]
      );

      const transferId = hre.ethers.keccak256(
        lala
      );

      await expect(() => 
        chainBridge.connect(owner).release(token.target, addr2.address, amount, transferId)
      ).to.changeTokenBalances(token, [chainBridge, addr2], [-amount, amount]);

      expect(await chainBridge.completedTransfers(transferId)).to.be.true;

      await expect(
        chainBridge.connect(owner).release(token.target, addr2.address, amount, transferId)
      ).to.emit(chainBridge, "TransferCompleted").withArgs(addr2.address, transferId, amount);
    });

    it("Should update the fee", async function () {
      const newFee = hre.ethers.parseEther("0.02");
      await chainBridge.connect(owner).updateFee(newFee);
      expect(await chainBridge.fee()).to.equal(newFee);
    });

    // it("Should withdraw ETH balance", async function () {
    //   const depositAmount = hre.ethers.parseEther("1");
    //   await owner.sendTransaction({ to: chainBridge.target, value: depositAmount });

    //   const ownerBalanceBefore = await hre.ethers.provider.getBalance(owner.address);
    //   await chainBridge.connect(owner).withdraw(depositAmount);
    //   const ownerBalanceAfter = await hre.ethers.provider.getBalance(owner.address);

    //   expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.be.closeTo(depositAmount, hre.ethers.parseEther("0.001"));
    // });

    it("Should withdraw token balance", async function () {
      const amount = hre.ethers.parseUnits("100", 18);
      await token.transfer(chainBridge.target, amount);

      await expect(() => 
        chainBridge.connect(owner).withdrawTokens(token.target, amount)
      ).to.changeTokenBalances(token, [chainBridge, owner], [-amount, amount]);
    });
  });
});
