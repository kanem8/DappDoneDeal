# DappDoneDeal

## Tech Stack

- Solidity (Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Prerequisites
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

(For anyone wanting to change the DappDoneDeal.sol smart contract:
This will command will compile contracts/DappDoneDeal.sol contract and run tests in test/DappDoneDealTest.js. 
The compiled contract json will be stored in a newly created artifacts directory - the ABI will be stored in this.
I have pushed a DappDoneDealABI.json for the react application to use. Any changes to the smart contract 
means you will need to replace this ABI with the newly compiled one - taken from the compiled DappDoneDeal.json file.)

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend
`$ npm run start`