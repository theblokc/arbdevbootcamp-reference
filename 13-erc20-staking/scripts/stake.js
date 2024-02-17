const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  const initialSupply = ethers.parseUnits("1000", 18);
  const myTokenContract = await await hre.ethers.deployContract("initialSupply", [initialSupply, owner.address]);
  await myTokenContract.waitForDeployment();

  const ethAmount = ethers.parseUnits("10", 18);
  await myTokenContract.connect(owner).mint(owner.address, ethAmount);
  await myTokenContract.connect(owner).stake(ethAmountStake);

  const stakedBalance = await myTokenContract.getStake(owner.address);
  console.log("Staking successful. Staked balance of Address:", stakedBalance.toString());
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});