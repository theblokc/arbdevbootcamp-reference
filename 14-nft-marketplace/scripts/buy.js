async function main() {
  const [ owner, addr1 ] = await ethers.getSigners();
  const myNftContract = await hre.ethers.deployContract("NftMarketplace");
  await myNftContract.waitForDeployment();

  await myNftContract.connect(owner).mint();

  const ethAmountSell = ethers.parseUnits("1", 18);
  await myNftContract.connect(owner).sell(0, ethAmountSell);

  await myNftContract.connect(addr1).buy(0);
}

main().then(() => process.exit(0).catch(err => {
  console.log(err);
  process.exit(1);
}))