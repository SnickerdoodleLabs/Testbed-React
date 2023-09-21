[![Snickerdoodle Protocol](/snickerdoodle_horizontal_notab.png)](https://snickerdoodle.com)

# Snickerdoodle Testbed for React App Web Integration Package

This is a minimal [React](https://react.dev/) application for demonstrating the [Snickerdoodle](https://snickerdoodle.com) web-native analytics package. It is meant to be an example guide for adding Snickerdoodle 
analytics to your own React-based [dApp](https://ethereum.org/en/developers/docs/dapps/). 

If you want to run this project locally or make your own modification, see [`DEV.md`](/DEV.md).

 ## 1. Install Dependencies

 You'll need to add [`@snickerdoodlelabs/web-integration`](https://www.npmjs.com/package/@snickerdoodlelabs/web-integration) to your [dependency](/package.json#L7) list:

```
yarn add @snickerdoodlelabs/web-integration reflect-metadata
```
or if you are using [NPM](https://www.npmjs.com/):

```
npm install @snickerdoodlelabs/web-integration reflect-metadata
```

You must also add [`reflect-metadata`](/package.json#L21) as well. 

## 2. Configuration of Web3 Data Providers

Snickerdoodle's web analytics package can fetch web3 data from multiple API providers. Checkout [`.example.env.local`](/.example.env.local) for a template environment variable file. Snickerdoodle recommends that you provide your own web3 API keys if you have hundreds of thousands of users or more so that indexer requests are not throttled. You will use these environment variables in your [application](/src/App.tsx#L55). 

If you choose you provide your own API keys, put them into an object which will be used as an input for step 3. The Typescript interface IConfigOverrides defines this type if you are using TS. In this full running example, we are using
environmentment variables that are referrenced with [`process.env`](https://create-react-app.dev/docs/adding-custom-environment-variables/). You project may be configured to reference environment variables in a different fashion. 

```
const webIntegrationConfig = {
  primaryInfuraKey: process.env.REACT_APP_INFURA_API_KEY!,
  ankrApiKey: process.env.REACT_APP_ANKR_API_KEY!,
  covalentApiKey: process.env.REACT_APP_COVALENT_API_KEY!,
  poapApiKey: process.env.REACT_APP_POAP_API_KEY!,
};
```

**Note**: You do not need to specifiy your own API keys. Snickerdoodle's `web-integration` analytics package comes with default API keys. The default keys may be rate limited, however, and this may affect your performance. Snickerdoodle recommends all integrators acquire their own keys before deploying to production. If you choose to rely on the default API keys set your config object to `{}`:

```
const webIntegrationConfig = {};
```

## 3. Import and Initialize Snickerdoodle Analytics

You must import [`reflect-metadata`](/src/App.tsx#L9) and [`SnickerdoodleWebIntegration`](/src/App.tsx#L10) into your application:

```
import "reflect-metadata"
import { SnickerdoodleWebIntegration } from '@snickerdoodlelabs/web-integration';
```

You must call the [`.initialize()`](/src/App.tsx#L78) method on the [`SnickerdoodleWebIntegration`](/src/App.tsx#L77) object in an appropriate place in your React app. 

```
const webIntegration = new SnickerdoodleWebIntegration(webIntegrationConfig, ethersSigner);
webIntegration.initialize();
```

If you choose to use the default configuration values (i.e. the default API keys) for your deployment, just pass an empty `{}` to the `SnickerdoodleWebIntegration` object:

```
const webIntegration = new SnickerdoodleWebIntegration({}, ethersSigner);
webIntegration.initialize();
```

**Note**: It is assumed that you are already creating a signer object in your dApp when the user is prompted to connect their wallet. You must pass this signer object to the `SnickerdoodleWebIntegration` object. This
repo demonstrates how to do that with WalletConnect.

## 4.  Add a TXT Record to Your Application's DNS Settings

You must add a single [TXT Record ](https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/) to your application's DNS Records so that the analytics package will
trigger the user agreement popup when a new user connects their wallet to your dApp. See our [official documentation](https://marketing-docs.snickerdoodle.com/integration-instructions/react-apps#3.-add-a-txt-record-to-your-react-apps-domain) for more info. 
