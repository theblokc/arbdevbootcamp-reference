import { ethers } from 'ethers';
import Wallet from '../interfaces/wallet';

interface MetaMaskEthereum {
  request: (args: { method: string }) => Promise<string | string[] | boolean | undefined>;
}

declare global {
  interface Window {
    ethereum: MetaMaskEthereum | undefined;
  }
}

export async function connectToMetaMask(): Promise<Wallet | null> {
  if (!window.ethereum) {
    console.error('MetaMask is not installed');
    return null;
  }
  await window.ethereum.request({ method: 'eth_accounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const balance = await provider.getBalance(await signer);

  const signerAddress = (await signer).address;
  
  const wallet = {} as Wallet;

  wallet.address = signerAddress
  wallet.balance = Number(balance);
  console.log(balance);
  return wallet;
}