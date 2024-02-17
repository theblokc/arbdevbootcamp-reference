const { expect } = require('chai');

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const initialSupply = ethers.parseEther('1');
  const myTokenContract = await await hre.ethers.deployContract("MyToken", [initialSupply, owner.address]);
  await myTokenContract.waitForDeployment();

  const gweiAmount = ethers.parseUnits("1000", "gwei");
  await myTokenContract.connect(owner).mint(addr1.address, gweiAmount);
  await myTokenContract.connect(owner).mint(addr2.address, gweiAmount);

  const gweiAmountStake = ethers.parseUnits("100", "gwei");
  await myTokenContract.connect(addr1).stake(gweiAmountStake);
  await myTokenContract.connect(addr2).stake(gweiAmountStake);

  const initialBalance = await myTokenContract.balanceOf(addr1.address);
  console.log("Addr1 initial balance after withdraw:", initialBalance.toString());

  const stakedBalance = await myTokenContract.getStake(addr1.address);
  console.log("Staking successful. Staked balance of addr1:", stakedBalance.toString());

  await new Promise(resolve => setTimeout(resolve, 10000));
  await myTokenContract.connect(addr1).withdraw();

  const stakedBalanceAfterWithdrawal = await myTokenContract.getStake(addr1.address);
  console.log("Withdrawal successful. Staked balance of addr1 after withdrawal:", stakedBalanceAfterWithdrawal.toString())

  const finalBalance = await myTokenContract.balanceOf(addr1.address);
  console.log("Addr1 final balance after withdraw:", finalBalance.toString());
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});