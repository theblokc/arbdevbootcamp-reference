import React, { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "./config";

function App() {
  const [provider, setProvider] = useState<null | BrowserProvider>(null);
  const [wallet, setWallet] = useState<null | string>(null);

  useEffect(() => {
    const checkProvider = async () => {
      const { ethereum } = window as any;
      try {
        const provider = new BrowserProvider(ethereum);
        setProvider(provider);
      } catch (e: any) {}
    };

    checkProvider();
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window as any;

    const accounts = await ethereum.request({
      method: "eth_accounts",
    });
    setWallet(accounts[0]);
  };

  const mint = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum, {
      name: "Arbitrum Stylus Testnet",
      chainId: 23011913
    });
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    console.log(signer.address)
    try {
      const tx = await contract.mint(BigInt(30));
      await tx.wait()
      alert(`Transaction Hash: ${tx.hash} Succefully minted`);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Transaction failed: ${decodedError?.args}`);
    }
  };

  const balanceOf = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum, {
      name: "Arbitrum Stylus Testnet",
      chainId: 23011913
    });
    const signer = await provider.getSigner();

    const contract = getContract(signer);
    try {
      const tx = await contract.balanceOf();
      const tokenBalance = Number(BigInt(tx).toString()) / Math.pow(10, 18)
      alert(`Your token balance is: ${tokenBalance}`);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Transaction failed: ${decodedError?.args}`);
    }
  }

  const totalSupply = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum, {
      name: "Arbitrum Stylus Testnet",
      chainId: 23011913
    });
    const signer = await provider.getSigner();

    const contract = getContract(signer);
    try {
      const tx = await contract.totalSupply();
      const tokenBalance = Number(BigInt(tx).toString()) / Math.pow(10, 18)
      alert(`Your token balance is: ${tokenBalance}`);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Transaction failed: ${decodedError?.args}`);
    }
  }
  return (
    <>
      {
        <button onClick={connectWallet}>
          {provider == null ? "Connect Wallet" : wallet}
        </button>
      }
      {provider != null ? <button onClick={mint}>Mint</button> : <></>}
      {provider != null ? <button onClick={balanceOf}>Balance</button> : <></>}
      {provider != null ? <button onClick={totalSupply}>Total Supply</button> : <></>}
    </>
  );
}

export default App;
