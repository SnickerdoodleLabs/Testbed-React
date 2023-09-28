import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { EVMAccountAddress, Signature } from "@snickerdoodlelabs/objects";
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
              <LetSnickerdoodleSign />
              <AskToSimpleSign />
              <AskToSignTypedData />
            </header>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

function LetSnickerdoodleSign() {
  // see /src/ethers.ts for conversion from wagmi signer to ethers signer object
  const ethersSigner = useEthersSigner();
  const { isConnected } = useAccount();

  // This shows how to authenticate the user's account with an Ethers signer
  // This option will present the user with a Snickerdoodle controlled personal sign message
  React.useEffect(() => {
    if (isConnected) {
      const webIntegration = new SnickerdoodleWebIntegration(
        webIntegrationConfig,
        ethersSigner,
      );
      webIntegration.initialize();
    }
  }, [isConnected, ethersSigner]);
  return <ConnectButton />;
}

function AskToSimpleSign() {
  const myMessage: string = "Hello Snickerdoodle!";
  const { data, isError, isSuccess, signMessage } = useSignMessage({
    message: myMessage,
  });
  const { address, isConnected } = useAccount();

  // This option shows how to authenticate a user account with a custom
  // personal sign message that your app may already be asking the user to sign
  React.useEffect(() => {
    if (isConnected && address && data) {
      const webIntegration = new SnickerdoodleWebIntegration(
        webIntegrationConfig,
      );
      webIntegration
        .initialize()
        .andThen((proxy) => {
          return proxy.account.addAccountWithExternalSignature(
            EVMAccountAddress(address),
            myMessage,
            Signature(data),
            1,
          );
        })
        .mapErr((err) => {
          console.log(err);
        });
    }
  }, [isConnected, address, data]);

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
  const { address, isConnected } = useAccount();

  const domain = {
    name: "Snickerdoodle",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  } as const;

  const types = {
    Login: [
      { name: "Contents", type: "string" },
      { name: "Nonce", type: "uint256" },
    ],
  };

  const message = {
    Contents: "Hello Snickerdoodle!",
    Nonce: BigInt(123),
  };

  const { data, isError, isLoading, isSuccess, signTypedData } =
    useSignTypedData({
      domain,
      message,
      primaryType: "Login",
      types,
    });

  // This option shows how to authenticate a user's account with a Typed Data signature
  // that your application may already be requiring the user to sign
  React.useEffect(() => {
    if (isConnected && address && domain && types && message && data && 1) {
      const webIntegration = new SnickerdoodleWebIntegration(
        webIntegrationConfig,
      );
      webIntegration
        .initialize()
        .andThen((proxy) => {
          return proxy.account.addAccountWithExternalTypedDataSignature(
            EVMAccountAddress(address),
            domain,
            types,
            message,
            Signature(data),
            1,
          );
        })
        .mapErr((err) => {
          console.log(err);
        });
    }
  }, [isConnected, address, domain, types, message, data]);

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
