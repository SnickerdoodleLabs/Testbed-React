![Snickerdoodle Protocol](/snickerdoodle_horizontal_notab.png)

## Local Testing

```
git clone https://github.com/SnickerdoodleLabs/Testbed-React.git
cd Testbed-React
npm install --legacy-peer-deps
mv .example.env.local .env.local
npm start
```

**NOTE**: You *must* put a [WalletConnect](https://cloud.walletconnect.com/sign-in) project id in the enviroment file otherwise the app will break at runtime.

## Pushing to Github Pages

This testbed app is hosted via [Github Pages ](https://pages.github.com/) and uses [`gh-pages`](https://www.npmjs.com/package/gh-pages)
for publishing. Additionally, this app uses [WalletConnect's](https://walletconnect.com/) [Web3Modal](https://web3modal.com/) library to
facilitate connecting a user's account to the application. You'll need to provide a project ID from your WalletConnect account for the 
application to function. 

```
npm run deploy
```
