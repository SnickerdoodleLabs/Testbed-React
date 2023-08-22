import React from 'react';
import snickerdoodle_logo from './snickerdoodle_logo.png';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { useWeb3Modal, Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig, useAccount, useSignMessage } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

import { useEthersSigner } from './ethers';
import './App.css';


const chains = [arbitrum, mainnet, polygon]
const projectId = '7b43f10fd3404bb16a3c0947b0ff3436'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function App() {

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <div className="App">
          <header className="App-header">
            <img src={snickerdoodle_logo} className="App-logo" alt="logo" />
            <Web3Button />
            <AskToSign />
          </header>
        </div>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

function AskToSign() {
  const { data, isError, isSuccess, signMessage } = useSignMessage({
    message: 'Hello Snickerdoodle!',
  })
  const { isConnected } = useAccount()
  let message 
  if (isConnected) {
    message = "Sign Message";
   } else {
    message = "Connect Wallet To Sign Message";
   }

  return (
    <div>
      <button onClick={() => signMessage()}>{message}</button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  ) 
}

export default App;
