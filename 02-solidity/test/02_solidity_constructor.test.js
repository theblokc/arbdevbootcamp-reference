const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SolidityConstructor", function () {
  async function deploy() {
    const [account1] = await ethers.getSigners();

    const SolidityConstructor = await ethers.getContractFactory(
      "SolidityConstructor"
    );
    const INITIAL_BALANCE = 1_000_000;

    const ctcSolidityConstructor = await SolidityConstructor.deploy(
      INITIAL_BALANCE
    );

    return { ctcSolidityConstructor, account1 };
  }

  describe("Deployment", function () {
    it("should call constructor", async function () {
      const { ctcSolidityConstructor } = await loadFixture(deploy);

      expect(ctcSolidityConstructor).not.to.be.undefined;
    });
  });
});
