import { useState } from 'react'
import { connectToMetaMask } from './helpers/metamask';
import './App.css'

function App() {
  const [signerAddress, setSignerAddress]  = useState("");
  const [balance, setBalance]  = useState<number>(0);

  const handleSignerAddress = async () => {
    const wallet = await connectToMetaMask();

    if(wallet) {
      setSignerAddress(wallet.address);
      setBalance(wallet.balance);
    }
  }
  
  handleSignerAddress();
  
  return (
    <>
      <div>
        <span>Signer Address: </span>
        <span>{signerAddress}</span>
      </div>
      <div>
        <span>Signer Balance: </span>
        <span>{balance} ETH</span>
      </div>
    </>
  )
}

export default App
