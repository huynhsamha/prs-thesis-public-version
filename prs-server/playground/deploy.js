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

/**
 * Configure Functions
 * use async for similar with configDefaultAccount_Local
 */
const configDefaultAccount_TestNet = async () => {
  /**
   * Add to wallet, can use sendTransaction()
   * Dont have to sign to transaction manually
   */
  const privateKey = config.eth.ropstenPrivateKey;
  const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);

  web3.eth.accounts.wallet.add(account);

  /** Set the default account, used to `from` */
  web3.eth.defaultAccount = account.address;
};

const configDefaultAccount_Local = async () => {
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
};

const configDefaultAccount = async () => {
  if (config.eth.network == 'testnet') {
    await configDefaultAccount_TestNet();
  } else {
    await configDefaultAccount_Local();
  }

  console.log('Default account address:', web3.eth.defaultAccount);
};

/**
 * Deploy new contract
 */
const deployPRSContract = () => new Promise(async (resolve, reject) => {
  try {
    const PRSContract = new web3.eth.Contract(abi);

    const txInstance = PRSContract.deploy({
      arguments: [],
      data: bytecode
    });

    const gasLimit = await txInstance.estimateGas();
    console.log('Gas limit: ', gasLimit);

    txInstance.send({
      from: web3.eth.defaultAccount,
      gas: gasLimit,
      gasPrice
    })
      .on('transactionHash', (txHash) => {
        console.log('Transaction Hash: ', txHash);
        resolve({ txHash });
      })
      .on('error', (err) => {
        reject(err);
      });

  } catch (err) {
    reject(err);
  }
});

/**
 * Start here
 * */
configDefaultAccount();

/**
 * Use setTimeout for waiting config accounts
 */
setTimeout(() => {
  console.log('Started. Please waiting...');

  deployPRSContract().then(({ txHash }) => {
    console.log(txHash);

  }).catch((err) => {
    console.log(err);
  });

}, 1000);
