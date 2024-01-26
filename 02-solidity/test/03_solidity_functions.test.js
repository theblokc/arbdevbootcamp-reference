const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SolidityFunctions", function () {
  async function deploy() {
    const [account1] = await ethers.getSigners();

    const SolidityFunctions = await ethers.getContractFactory(
      "SolidityFunctions"
    );
    const INITIAL_BALANCE = 1_000_000;

    const ctcSolidityFunctions = await SolidityFunctions.deploy(
      INITIAL_BALANCE
    );

    return { ctcSolidityFunctions, account1 };
  }

  describe("Deployment", function () {
    it("should call constructor", async function () {
      const { ctcSolidityFunctions } = await loadFixture(deploy);

      expect(ctcSolidityFunctions).not.to.be.undefined;
    });

    it("should add balance", async function () {
      const { ctcSolidityFunctions } = await loadFixture(deploy);

      await ctcSolidityFunctions.addBalance(1_000_000);

      const balance = await ctcSolidityFunctions.getBalance();
      console.log("balance is now ", balance);
    });
  });
});
