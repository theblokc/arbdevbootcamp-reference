const { ethers } = require("hardhat");

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  const initialSupply = ethers.parseEther('1');
  const myTokenContract = await await hre.ethers.deployContract("initialSupply", [initialSupply, owner.address]);
  await myTokenContract.waitForDeployment();

  const gweiAmount = ethers.parseUnits("1000", "gwei");
  await myTokenContract.connect(owner).mint(addr1.address, gweiAmount);
  await myTokenContract.connect(addr1).stake(gweiAmount);

  const stakedBalance = await myTokenContract.getStake(addr1.address);
  console.log("Staking successful. Staked balance of addr1:", stakedBalance.toString());
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});