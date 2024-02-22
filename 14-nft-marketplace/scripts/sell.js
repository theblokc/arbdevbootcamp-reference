const { ethers } = require("hardhat");

async function main() {
  const [ owner ] = await ethers.getSigners();
  const myNftContract = await hre.ethers.deployContract("NftMarketplace");
  await myNftContract.waitForDeployment();

  await myNftContract.connect(owner).mint();

  const ethAmount = ethers.parseUnits("1", 18);
  await myNftContract.connect(owner).sell(0, ethAmount);
}

main().then(() => process.exit(0).catch(err => {
  console.log(err);
  process.exit(1);
}))