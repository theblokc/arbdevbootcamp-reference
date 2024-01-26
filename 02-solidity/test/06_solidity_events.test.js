const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SolidityEvents", function () {
  async function deploy() {
    const [account1] = await ethers.getSigners();

    const SolidityEvents = await ethers.getContractFactory("SolidityEvents");
    const INITIAL_BALANCE = 1_000_000;

    const ctcSolidityEvents = await SolidityEvents.deploy(
      INITIAL_BALANCE,
      account1
    );

    return { ctcSolidityEvents, account1 };
  }

  describe("Deployment", function () {
    it("should call constructor", async function () {
      const { ctcSolidityEvents } = await loadFixture(deploy);

      expect(ctcSolidityEvents).not.to.be.undefined;
    });

    it("should add balance if owner", async function () {
      const { ctcSolidityEvents, account1 } = await loadFixture(deploy);

      await expect(ctcSolidityEvents.addBalance(1_000_000))
        .to.emit(ctcSolidityEvents, "BalanceAdded")
        .withArgs(account1);

      const balance = await ctcSolidityEvents.getBalance();
      console.log("balance is now ", balance);
    });
  });
});
