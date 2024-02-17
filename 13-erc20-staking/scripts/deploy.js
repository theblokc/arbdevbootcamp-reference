const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const initialSupply = '100000000000000000000';
  const myTokenContract = await await hre.ethers.deployContract("MyToken", [initialSupply, deployer.address]);

  await myTokenContract.waitForDeployment();
  console.log(`Contract deployed to ${myTokenContract.target}`);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

