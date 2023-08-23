![Snickerdoodle Protocol](/snickerdoodle_horizontal_notab.png)

# Snickerdoodle Testbed for React App Web Integration Package

This is a minimal [React](https://react.dev/) application for testing the Snickerdoodle analytics web integration package. 

 ## Install Dependencies

 You'll need to add [`@snickerdoodlelabs/web-integration
`](https://www.npmjs.com/package/@snickerdoodlelabs/web-integration) to you dependency list:

```
yarn add @snickerdoodlelabs/web-integration
```

## Configuration and Environment Variables

Checkout [`.example.env.local`](/.example.env.local) for a template environment variable file. You *must* provide an [Infura 
API key](https://www.infura.io/) for the package to function. You will use these environment variables in your [application](/src/App.tsx#L36). 