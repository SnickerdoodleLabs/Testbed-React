import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import "reflect-metadata";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import React from "react";
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useSignMessage,
  useSignTypedData,
} from "wagmi";
import {
  arbitrum,
  optimism,
  mainnet,
  polygon,
  avalanche,
  avalancheFuji,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { useEthersSigner } from "./ethers";
import snickerdoodle_logo from "./snickerdoodle_logo.png";
import "./App.css";

// ----------------- Check for Wallet Connect Project ID ------------------
console.log(process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID);
if (!process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID) {
  throw new Error(
    "You need to provide a WalletConnect Project ID env variable",
  );
}
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

// -------------------------- WAGMI Configuration
const chains = [arbitrum, optimism, mainnet, polygon, avalanche, avalancheFuji];
const { publicClient } = configureChains(chains, [publicProvider()]);
const { connectors } = getDefaultWallets({
  appName: "Snickerdoodle Testbed",
  projectId: projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// ----------------------------------------------------------------------------------

// if you choose to rely on default API keys, use this config instead

const webIntegrationConfig = {};

/*const webIntegrationConfig = {
  primaryInfuraKey: process.env.REACT_APP_INFURA_API_KEY!,
  ankrApiKey: process.env.REACT_APP_ANKR_API_KEY!,
  covalentApiKey: process.env.REACT_APP_COVALENT_API_KEY!,
  poapApiKey: process.env.REACT_APP_POAP_API_KEY!,
};*/

// -------------------------------------------------------------------------------------

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} initialChain={mainnet}>
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
              <ConnectButton />
              <AskToSimpleSign />
              <AskToSignTypedData />
            </header>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

function AskToSimpleSign() {
  const ethersSigner = useEthersSigner();
  const { data, isError, isSuccess, signMessage } = useSignMessage({
    message: "Hello Snickerdoodle!",
  });
  const { isConnected } = useAccount();

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
      console.log("Full Signature String: " + data);
    }
  }, [data]);

  if (isConnected) {
    return (
      <>
        <button className="button-64" onClick={() => signMessage()}>
          Personal Sign
        </button>
        {isSuccess && (
          <div>
            Signature:{" "}
            {data?.slice(0, 12) +
              "..." +
              data?.slice(data.length - 13, data.length - 1)}
          </div>
        )}
        {isError && <div>Error signing message</div>}
      </>
    );
  } else {
    return <></>;
  }
}

function AskToSignTypedData() {
  const { isConnected } = useAccount();

  const domain = {
    name: "Snickerdoodle",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  } as const;

  const types = {
    Login: [
      { name: "Contents", type: "string" },
      { name: "Nonce", type: "string" },
    ],
  } as const;

  const message = {
    Contents: "Hello Snickerdoodle!",
    Nonce: "123",
  } as const;

  const { data, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData({
      domain,
      message,
      primaryType: "Login",
      types,
    });

  React.useEffect(() => {
    if (data) {
      console.log("Full Signature String: " + data);
    }
  }, [data]);

  if (isConnected) {
    return (
      <>
        <button className="button-64" onClick={() => signTypedData()}>
          Sign Typed Data
        </button>
        {isSuccess && (
          <div>
            Signature:{" "}
            {data?.slice(0, 12) +
              "..." +
              data?.slice(data.length - 13, data.length - 1)}
          </div>
        )}
        {isError && <div>Error signing message</div>}
      </>
    );
  } else {
    return <></>;
  }
}

export default App;
