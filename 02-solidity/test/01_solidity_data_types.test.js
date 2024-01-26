const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SolidityDataTypes", function () {
  async function deploy() {
    const [account1] = await ethers.getSigners();

    const SolidityDataTypes = await ethers.getContractFactory(
      "SolidityDataTypes"
    );
    const ctcSolidityDataTypes = await SolidityDataTypes.deploy();

    return { ctcSolidityDataTypes, account1 };
  }

  describe("Deployment", function () {
    it("should call constructor", async function () {
      const { ctcSolidityDataTypes } = await loadFixture(deploy);

      expect(ctcSolidityDataTypes).not.to.be.undefined;
    });
  });
});
