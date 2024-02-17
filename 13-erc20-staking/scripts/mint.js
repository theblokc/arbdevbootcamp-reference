const { ethers } = require("hardhat");

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  const initialSupply = ethers.parseEther('1');
  const myTokenContract = await await hre.ethers.deployContract("MyToken", [initialSupply, owner.address]);
  await myTokenContract.waitForDeployment();

  const gweiAmount = ethers.parseUnits("1000", "gwei");
  await myTokenContract.connect(owner).mint(addr1.address, gweiAmount);
  
  const balance = await myTokenContract.balanceOf(addr1.address);
  console.log("Minting successful. Balance of addr1:", balance.toString());
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
