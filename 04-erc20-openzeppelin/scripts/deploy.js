const hre = require("hardhat");

async function main() {
  const initialSupply = '100000000000000000000'
  const nameYourTokenContract = await hre.ethers.deployContract("NameYourToken", [initialSupply]);

  await nameYourTokenContract.waitForDeployment();

  console.log(`Contract deployed to ${nameYourTokenContract.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
