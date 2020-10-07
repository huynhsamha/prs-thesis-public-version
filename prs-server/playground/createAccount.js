require('dotenv').config();

const Web3 = require('web3');
const config = require('./config');

const PRSContractJSON = require('../build/contracts/PRSContract.json');

/**
 * ==========================================================================
 * Configure Ethereum
 * ==========================================================================
 * */
const provider = config.eth.network == 'testnet' ? config.eth.provider : 'http://localhost:8545';
console.log('Ethereum provider:', provider);

const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const { abi, bytecode } = PRSContractJSON;
const gasPrice = web3.utils.toHex(1e9);

const createAccount = () => {
  const acc = web3.eth.accounts.create();
  console.log(acc);
};

createAccount();
