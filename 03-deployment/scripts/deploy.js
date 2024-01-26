const hre = require("hardhat");

async function main() {
  const addBalanceContract = await hre.ethers.deployContract("AddBalance", [0]);

  await addBalanceContract.waitForDeployment();

  console.log(`Contract deployed to ${addBalanceContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
