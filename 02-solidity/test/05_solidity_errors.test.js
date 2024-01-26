const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SolidityModifiers", function () {
  async function deploy() {
    const [account1, account2] = await ethers.getSigners();

    const SolidityErrors = await ethers.getContractFactory("SolidityErrors");
    const INITIAL_BALANCE = 1_000_000;

    const ctcSolidityErrors = await SolidityErrors.deploy(
      INITIAL_BALANCE,
      account1
    );

    return { ctcSolidityErrors, account1, account2 };
  }

  describe("Deployment", function () {
    it("should call constructor", async function () {
      const { ctcSolidityErrors } = await loadFixture(deploy);

      expect(ctcSolidityErrors).not.to.be.undefined;
    });

    it("should add balance if owner", async function () {
      const { ctcSolidityErrors, account1 } = await loadFixture(deploy);
      await ctcSolidityErrors.connect(account1).addBalance(1_000_000);

      const balance = await ctcSolidityErrors.getBalance();
      console.log("balance is now ", balance);
    });

    it("should fail if not owner", async function () {
      const { ctcSolidityErrors, account2 } = await loadFixture(deploy);
      try {
        await ctcSolidityErrors.connect(account2).addBalance(1_000_000);
      } catch (error) {
        // Error: VM Exception while processing transaction: reverted with custom error 'YouAreNotError()
        console.log(error);
      }
      const balance = await ctcSolidityErrors.getBalance();
      console.log("balance is now ", balance);
    });
  });
});
