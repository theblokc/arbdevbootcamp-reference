async function main() {
  const myNFTContract = await await hre.ethers.deployContract("NftMarketplace");
  await myNFTContract.waitForDeployment();
  console.log(`Contract deployed to ${myNFTContract.target}`);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

