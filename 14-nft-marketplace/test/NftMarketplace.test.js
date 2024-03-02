const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NftMarketplace", function () {
  let owner, addr1;
  let myNFTContract;

  before(async function () {
    [owner, addr1] = await ethers.getSigners();
    myNFTContract = await hre.ethers.deployContract("NftMarketplace");
    await myNFTContract.waitForDeployment();
    console.log(`\tContract deployed to ${myNFTContract.target}`);
  });

  describe("Mint NFT", async function () {
    it("Should increase minter balance", async function () {
      await myNFTContract.connect(owner).mint();
      await myNFTContract.connect(owner).mint();
      const minterBalance = await myNFTContract.balanceOf(owner.address);
      expect(2).to.equal(minterBalance);
    });
  });

  describe("Sell NFT", async function () {
    it("Holder should transfer NFT ownership to contract", async function () {
      const ethAmount = ethers.parseUnits("0.000001", 18);
      await myNFTContract.connect(owner).sell(0, ethAmount);
      let newOwner = await myNFTContract.ownerOf(0);
      expect(myNFTContract.target).to.equal(newOwner);
    });

    it("NFT should have a price", async function () {
      const ethAmount = ethers.parseUnits("0.000001", 18);
      const tokenPrice = await myNFTContract.tokenPrice(0);
      console.log(`\tToken Price: ${tokenPrice}`);
      expect(tokenPrice).to.equal(ethAmount);
    });
  });

  describe("Buy NFT", async function () {
    it("Buyer should own the NFT", async function () {
      const balance = await ethers.provider.getBalance(addr1.address);
      console.log(`\tAddress Balance: ${balance}`);
      await myNFTContract.connect(addr1).buy(0, { value: ethers.parseUnits("0.000001", 18) });
      let newOwner = await myNFTContract.ownerOf(0);
      expect(addr1.address).to.equal(newOwner);
    });

    it("Amount transfered to owner", async function () {
      const balance = await ethers.provider.getBalance(owner.address);
      console.log(`\tAddress Balance: ${balance}`);
    });
  });

  // Add more test cases as needed

});