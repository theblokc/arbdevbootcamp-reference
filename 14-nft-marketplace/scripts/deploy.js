async function main() {
  const myNftContract = await hre.ethers.deployContract("NftMarketplace");
  await myNftContract.waitForDeployment();
  console.log(`Contract deployed to ${myNftContract.target}`);
}

main().then(() => process.exit(0).catch(err => {
  console.log(err);
  process.exit(1);
}))