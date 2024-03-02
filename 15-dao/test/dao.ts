import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Basic Dao tests", function () {
  async function tokenContract(
    name: string,
    symbol: string,
    initialSupply: number
  ) {
    const Token = await ethers.getContractFactory("Token");
    return await Token.deploy(name, symbol, initialSupply);
  }

  async function daoContract(tokenAddress: string, proposalRequired: Number) {
    const DAO = await ethers.getContractFactory("DAO");
    return await DAO.deploy(tokenAddress, Number(proposalRequired));
  }

  async function deployContracts() {
    const [owner, otherAccount] = await ethers.getSigners();
    const Token = await tokenContract("DAODAO", "DAO", 0);
    const Dao = await daoContract(await Token.getAddress(), 1);
    return { Token, Dao, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be able to buy tokens", async function () {
      const BUY_AMOUNT = 5;
      const { Token, otherAccount } = await loadFixture(deployContracts);
      const contract = Token.connect(otherAccount);
      const tx = await contract.buy(BUY_AMOUNT);
      await tx.wait();
      expect(Number(await Token.balanceOf(otherAccount.address))).equal(
        BUY_AMOUNT * 10 ** 18
      );
    });

    it("Should be able to set token price", async function () {
      const PRICE_CHANGE = 100;
      const { Token } = await loadFixture(deployContracts);
      const tx = await Token.setPrice(PRICE_CHANGE);
      await tx.wait();
      expect(Number(await Token.tokenPrice())).equal(PRICE_CHANGE);
    });

    it("Should be able to create proposal", async function () {
      const NUMBER_OF_TOKENS = 1;
      const { Token, Dao, otherAccount } = await loadFixture(deployContracts);
      const tokenContract = Token.connect(otherAccount);
      const tx = await tokenContract.buy(NUMBER_OF_TOKENS);
      await tx.wait();
      const daoContract = Dao.connect(otherAccount);

      const PROPOSAL_TITLE: string = "Chicken or Egg";
      const PROPOSAL_DESCRIPTION: string = "What came first?";
      const tx1 = await daoContract.createProposal(
        PROPOSAL_TITLE,
        PROPOSAL_DESCRIPTION
      );
      await tx1.wait();
      const tempProposal = await daoContract.proposals(0);
      expect(tempProposal.creator).equal(otherAccount.address);
      expect(tempProposal.title).equal(PROPOSAL_TITLE);
      expect(tempProposal.description).equal(PROPOSAL_DESCRIPTION);
      expect(tempProposal.yes).equal(0);
      expect(tempProposal.no).equal(0);
    });

    it("Should be able to vote on a proposal", async function () {
      const { Token, Dao, otherAccount } = await loadFixture(deployContracts);
      const tokenContract = Token.connect(otherAccount);
      const NUMBER_OF_TOKENS = 1;
      const tx = await tokenContract.buy(NUMBER_OF_TOKENS);
      await tx.wait();

      const daoContract = Dao.connect(otherAccount);
      const PROPOSAL_TITLE: string = "Chicken or Egg";
      const PROPOSAL_DESCRIPTION: string = "What came first?";
      const tx2 = await daoContract.createProposal(
        PROPOSAL_TITLE,
        PROPOSAL_DESCRIPTION
      );
      await tx2.wait();

      const tx3 = await daoContract.vote(0, true);
      await tx3.wait();

      const tempProposal = await daoContract.proposals(0);

      expect(tempProposal.creator).equal(otherAccount.address);
      expect(tempProposal.title).equal(PROPOSAL_TITLE);
      expect(tempProposal.description).equal(PROPOSAL_DESCRIPTION);
      expect(tempProposal.yes).equal(1);
      expect(tempProposal.no).equal(0);
    });
  });
});
