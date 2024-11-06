const { expect } = require("chai");
const hre = require("hardhat");

describe("ChainBridge", function () {
  let ChainBridge, chainBridge, owner, addr1, addr2, token;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a mock ERC20 token
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    // Deploy the ChainBridge contract
    ChainBridge = await ethers.getContractFactory("ChainBridge");
    chainBridge = await ChainBridge.deploy(owner.address, hre.ethers.parseEther("0.01"));
    await chainBridge.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await chainBridge.owner()).to.equal(owner.address);
    });

    it("Should set the initial fee", async function () {
      expect(await chainBridge.fee()).to.equal(hre.ethers.parseEther("0.01"));
    });
  });
  
});
