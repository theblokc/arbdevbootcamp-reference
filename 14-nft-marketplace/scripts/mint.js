const { ethers } = require("hardhat");

async function main() {
  const [ owner ] = await ethers.getSigners();
  const myNFTContract = await await hre.ethers.deployContract("NftMarketplace");
  await myNFTContract.waitForDeployment();

  await myNFTContract.connect(owner).mint();
  console.log(`Contract deployed to ${myNFTContract.target}`);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

