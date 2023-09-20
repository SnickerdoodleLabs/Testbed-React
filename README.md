![Snickerdoodle Protocol](/snickerdoodle_horizontal_notab.png)

# Snickerdoodle Testbed for React App Web Integration Package

This is a minimal [React](https://react.dev/) application for testing the Snickerdoodle analytics web integration package. 

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

## 2. Configuration and Environment Variables

Checkout [`.example.env.local`](/.example.env.local) for a template environment variable file. Snickerdoodle recommends that you provide your own API keys if you have a large userbase so that data requests are not throttled. You will use these environment variables in your [application](/src/App.tsx#L37). 

**Note** You do not need to specifiy your own API keys. Snickerdoodle's `web-integration` analytics package comes with default API keys. 

## 3. Initialize Snickerdoodle Analytics

You must call the [`.initialize()`](/src/App.tsx#L78) method on the [`SnickerdoodleWebIntegration`](/src/App.tsx#L77) object. 
