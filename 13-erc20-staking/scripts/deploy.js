const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const initialSupply = ethers.parseUnits("1000", 18);
  const myTokenContract = await await hre.ethers.deployContract("MyToken", [initialSupply, deployer.address]);

  await myTokenContract.waitForDeployment();
  const balance = await myTokenContract.balanceOf(deployer.address);
  console.log(`Balance of ${deployer.address}: ${balance.toString()} tokens`);
  console.log(`Contract deployed to ${myTokenContract.target}`);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

