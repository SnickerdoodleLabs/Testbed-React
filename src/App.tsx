import React from 'react';
import snickerdoodle_logo from './snickerdoodle_logo.png';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig, useAccount, useSignMessage } from 'wagmi'
import { arbitrum, mainnet, polygon, avalanche, avalancheFuji } from 'wagmi/chains'

import "reflect-metadata"
import { SnickerdoodleWebIntegration } from '@snickerdoodlelabs/web-integration';

import { useEthersSigner } from './ethers';
import './App.css';

// Wallet Connect Configuration
const chains = [arbitrum, mainnet, polygon, avalanche, avalancheFuji]
console.log(process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID)
if (!process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID) {
  throw new Error("You need to provide a WalletConnect Project ID env variable");
}
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

if (!process.env.REACT_APP_INFURA_API_KEY) {
  throw new Error("You need to provide currently provide an Infura API env variable");
}

// Snickerdoodle Configuration
const webIntegrationConfig = {
  primaryInfuraKey: process.env.REACT_APP_INFURA_API_KEY,
  ankrApiKey: process.env.REACT_APP_ANKR_API_KEY,
  covalentApiKey: process.env.REACT_APP_COVALENT_API_KEY,
  iframeURL: 'https://iframe.snickerdoodle.com',
}

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
  const message = "Sign Message";
  const ethersSigner = useEthersSigner();
  //const webIntegration = new SnickerdoodleWebIntegration(webIntegrationConfig, ethersSigner);

  if (isConnected) {
    return (
      <div>
        <button onClick={() => signMessage()}>{message}</button>
        {isSuccess && <div>Signature: {data?.slice(0, 12) + "..." + data?.slice(data.length - 13, data.length - 1)}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    )
  } else {
    return <></>
  }
}

export default App;
