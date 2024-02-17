const { expect } = require('chai');

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  const initialSupply = '100000000000000000000';
  const myTokenContract = await await hre.ethers.deployContract("MyToken", [initialSupply, owner.address]);
  await myTokenContract.waitForDeployment();

  await myTokenContract.connect(owner).mint(addr1.address, 1000);
  await myTokenContract.connect(addr1).stake(1000);

  const stakedBalance = await myTokenContract.getStake(addr1.address);
  expect(stakedBalance).to.equal(1000);
  console.log("Staking successful. Staked balance of addr1:", stakedBalance.toString());
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});