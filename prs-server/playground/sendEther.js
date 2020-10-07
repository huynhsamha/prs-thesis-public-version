require('dotenv').config();

const Web3 = require('web3');
const config = require('./config');
const moment = require('moment');

/**
 * ==========================================================================
 * Configure Ethereum
 * ==========================================================================
 * */
const provider = config.eth.network == 'testnet' ? config.eth.provider : 'http://localhost:8545';
console.log('Ethereum provider:', provider);

const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const gasPrice = web3.utils.toHex(1e9);

const toAddress = '0x4E5***C4F';

/**
 * Configure Functions
 * use async for similar with configDefaultAccount_Local
 */
const configDefaultAccount_TestNet = async () => {
  /**
   * Add to wallet, can use sendTransaction()
   * Dont have to sign to transaction manually
   */
  const privateKey = config.eth.ropstenPrivateKey2;
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

const sendEther = ({ toAddress }) => new Promise(async (resolve, reject) => {
  try {
    const utils = web3.utils;
    // const utils = Web3.default.utils;

    const gasLimit = web3.utils.toHex(1e5);
    console.log('Gas limit:', gasLimit);

    const address = web3.eth.defaultAccount;

    web3.eth.sendTransaction({
      from: address,
      to: toAddress,
      value: utils.toWei('0.005', 'ether'),
      gasLimit,
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

  sendEther({ toAddress }).then(({ txHash }) => {
    console.log(txHash);

  }).catch((err) => {
    console.log(err);
  });

}, 1000);
