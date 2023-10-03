[![Snickerdoodle Protocol](/snickerdoodle_horizontal_notab.png)](https://snickerdoodle.com)

# Web Integration Testbed for React

This is a minimal [React](https://react.dev/) application for demonstrating the [Snickerdoodle](https://snickerdoodle.com) web-native analytics package. It is meant to be an example guide for adding Snickerdoodle analytics to your own React-based [dApp](https://ethereum.org/en/developers/docs/dapps/). 

This example repo specifically uses [RainbowKit](https://www.rainbowkit.com/) in conjunction with [Wagmi](https://wagmi.sh/) for establishing a connection with a user's wallet. However, Snickerdoodle analytics is unopinionated in regards to the wallet connection technology. It can easily be used with other technologies like [WalletConnect](https://walletconnect.com/) or simply use the `window.ethereum` object available on most browser extension-based wallet applications. 

If you want to run this project locally or make your own modification, see [`DEV.md`](/DEV.md).

 ## 1. Install Dependencies

 You'll need to add [`@snickerdoodlelabs/web-integration`](https://www.npmjs.com/package/@snickerdoodlelabs/web-integration) to your [dependency](/package.json#L7) list:

```
yarn add @snickerdoodlelabs/web-integration
```
or if you are using [NPM](https://www.npmjs.com/):

```
npm install @snickerdoodlelabs/web-integration
```

## 2. Configuration of Web3 Data Providers

Snickerdoodle's web analytics package can fetch web3 data from multiple API providers (for redundancy and robustness). Checkout [`.example.env.local`](/.example.env.local) for a template environment variable file. Snickerdoodle recommends that you provide your own web3 API keys if you have hundreds of thousands of users or more so that indexer requests are not throttled. You will use these environment variables in your [application](/src/App.tsx#L64). 

If you choose to provide your own API keys, put them into an object which will be used as an input for step 3. The Typescript interface IConfigOverrides defines this type if you are using TS. In this full running example, we are using
environnement variables that are referenced with [`process.env`](https://create-react-app.dev/docs/adding-custom-environment-variables/). You project may be configured to reference environment variables in a different fashion. 

```
const webIntegrationConfig = {
  primaryInfuraKey: process.env.REACT_APP_INFURA_API_KEY!,
  ankrApiKey: process.env.REACT_APP_ANKR_API_KEY!,
  covalentApiKey: process.env.REACT_APP_COVALENT_API_KEY!,
  poapApiKey: process.env.REACT_APP_POAP_API_KEY!,
};
```

**Note**: You do not need to specify your own API keys. Snickerdoodle's `web-integration` analytics package comes with default API keys. The default keys may be rate limited, however, and this may affect your performance. Snickerdoodle recommends all integrators acquire their own keys before deploying to production. If you choose to rely on the default API keys set your config object to [`{}`](/src/App.tsx#L61):

```
const webIntegrationConfig = {};
```

## 3. Import Snickerdoodle Analytics

You must import [`SnickerdoodleWebIntegration`](/src/App.tsx#L8) into your application:

```
import { SnickerdoodleWebIntegration } from '@snickerdoodlelabs/web-integration';
```

Additionally, if you choose one of the signature-based authentication methods in step 4, you must also import some [objects](/src/App.tsx#L7):

```
import { EVMAccountAddress, Signature } from "@snickerdoodlelabs/objects";
```

**Note** You do not need to import from `@snickerdoodlelabs/objects` if you simply use the default initialization method described in step 4. 

## 4. Choose Your Preferred Authentication Method

Snickerdoodle analytics offers 3 equivalent methods to authenticate a user's wallet against their decentralized user profile:

1. A Snickerdoodle-managed [EIP-191 (personal sign)](https://eips.ethereum.org/EIPS/eip-191) prompt
2. An application-managed [EIP-191 (personal sign)](https://eips.ethereum.org/EIPS/eip-191)) prompt
3. An application-managed [EIP-712 (sign typed data)](https://eips.ethereum.org/EIPS/eip-712) prompt

### Snickerdoodle-managed EIP-191 Personal Sign Authentication

If your dApp does not already ask a user for a login signature, allowing the Snickerdoodle analytics package to prompt the user for a simple login signature
is likely the simplest route. See the [`LetSnickerdoodleSign()`](/src/App.tsx#L103) component. The relevant code block is the following:

```
const webIntegration = new SnickerdoodleWebIntegration(webIntegrationConfig, ethersSigner);
webIntegration.initialize();
```

**Note**: The `ethersSigner` object is assumed to be a V5 Ethers signer object. If you are using `wagmi` to manage signature requests, you'll probably need to 
add [`ethers.ts`](/src/ethers.ts) to you project and [import](/src/App.tsx#L28) it in an appropriate location;

### Application-managed EIP-191 Personal Sign Authentication

If your dApp is already prompting the user to perform a simple signature of a login message, you can use the result of that operation to authenticate the user's
wallet against their decentralized profile. See the [`AskToSimpleSign()`](/src/App.tsx#L138) component. The relevant code block is the following:

```
const webIntegration = new SnickerdoodleWebIntegration(webIntegrationConfig,);
webIntegration.initialize().andThen((proxy) => {
    return proxy.account.addAccountWithExternalSignature(
      EVMAccountAddress(address),
      myMessage,
      Signature(data),
      1,
    );
  }).mapErr((err) => {console.log(err);});
```

### Application-managed EIP-712 Sign Typed Data Authentication

If you dApp is already prompting the user to perform a signature of a typed data payload that is [EIP-712](https://eips.ethereum.org/EIPS/eip-712) compatible, you can use the result of that operation to authenticate the user's wallet against their decentralized user profile. See the [`AskToSignTypedData()`](/src/App.tsx#L204) component. The relevant code block is the following:

```
const webIntegration = new SnickerdoodleWebIntegration(webIntegrationConfig,);
webIntegration.initialize().andThen((proxy) => {
    return proxy.account.addAccountWithExternalTypedDataSignature(
      EVMAccountAddress(address),
      domain,
      types,
      message,
      Signature(data),
      1,
    );
  }).mapErr((err) => {
    console.log(err);
  });
```

## 4.  Add a TXT Record to Your Application's DNS Settings

You must add a single [TXT Record ](https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/) to your application's DNS Records so that the analytics package will
trigger the user agreement popup when a new user connects their wallet to your dApp. See our [official documentation](https://marketing-docs.snickerdoodle.com/integration-instructions/react-apps#3.-add-a-txt-record-to-your-react-apps-domain) for more info. 
