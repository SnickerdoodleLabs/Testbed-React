import "reflect-metadata";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, Web3Button } from "@web3modal/react";
import React from "react";
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useSignMessage,
} from "wagmi";
import {
  arbitrum,
  mainnet,
  polygon,
  avalanche,
  avalancheFuji,
} from "wagmi/chains";

import { useEthersSigner } from "./ethers";
import snickerdoodle_logo from "./snickerdoodle_logo.png";
import "./App.css";

// ------------------------- Wallet Connect Configuration ---------------------------
const chains = [arbitrum, mainnet, polygon, avalanche, avalancheFuji];
console.log(process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID);
if (!process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID) {
  throw new Error(
    "You need to provide a WalletConnect Project ID env variable",
  );
}
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
// ----------------------------------------------------------------------------------

// if you choose to rely on default API keys, use this config instead
/*
const webIntegrationConfig = {};
*/

const webIntegrationConfig = {
  primaryInfuraKey: process.env.REACT_APP_INFURA_API_KEY!,
  ankrApiKey: process.env.REACT_APP_ANKR_API_KEY!,
  covalentApiKey: process.env.REACT_APP_COVALENT_API_KEY!,
  poapApiKey: process.env.REACT_APP_POAP_API_KEY!,
};

// -------------------------------------------------------------------------------------

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <div className="App">
          <header className="App-header">
            <a
              className="App-link"
              href="https://github.com/SnickerdoodleLabs/Testbed-React/tree/main"
              target="_blank"
              rel="noopener noreferrer"
            >
              Snickerdoodle Labs React Testbed
            </a>
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
  const ethersSigner = useEthersSigner();
  const { data, isError, isSuccess, signMessage } = useSignMessage({
    message: "Hello Snickerdoodle!",
  });
  const { isConnected } = useAccount();
  const message = "Sign Message";

  React.useEffect(() => {
    if (isConnected && ethersSigner) {
      const webIntegration = new SnickerdoodleWebIntegration(
        webIntegrationConfig,
        ethersSigner,
      );
      webIntegration.initialize();
    }
  }, [isConnected, ethersSigner]);

  React.useEffect(() => {
    if (data) {
      console.log("Full Signature String:" + data);
    }
  }, [data]);

  if (isConnected) {
    return (
      <div>
        <button onClick={() => signMessage()}>{message}</button>
        {isSuccess && (
          <div>
            Signature:{" "}
            {data?.slice(0, 12) +
              "..." +
              data?.slice(data.length - 13, data.length - 1)}
          </div>
        )}
        {isError && <div>Error signing message</div>}
      </div>
    );
  } else {
    return <></>;
  }
}

export default App;
