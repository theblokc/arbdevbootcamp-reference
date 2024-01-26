"use client";

import { BrowserProvider, JsonRpcProvider } from "ethers";
import { useState } from "react";

export default function Home() {
  const [walletkey, setWalletKey] = useState("");
  const [balance, setBalance] = useState<number>(0);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    try {
      const provider = new BrowserProvider(ethereum);
      const account = await provider.send("eth_accounts", []);
      setWalletKey(account[0]);
      getBalance(account[0]);
    } catch (e: any) {}
  };

  const getBalance = async (walletKey: any) => {
    try {
      const provider = new JsonRpcProvider(
        "https://sepolia-rollup.arbitrum.io/rpc"
      );

      setBalance(Number(await provider?.getBalance(walletKey)));
    } catch (e: any) {}
  };

  return (
    <main>
      <button onClick={connectWallet}>Click Me</button>
      <p>{walletkey}</p>
      <p>{balance}</p>
    </main>
  );
}
