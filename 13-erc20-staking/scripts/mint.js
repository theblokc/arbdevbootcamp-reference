const { expect } = require('chai');

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  const initialSupply = '100000000000000000000';
  const myTokenContract = await await hre.ethers.deployContract("MyToken", [initialSupply, owner.address]);
  await myTokenContract.waitForDeployment();
  await myTokenContract.connect(owner).mint(addr1.address, 1000);
  const balance = await myTokenContract.balanceOf(addr1.address);
  expect(balance).to.equal(1000);
  console.log("Minting successful. Balance of addr1:", balance.toString());
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
