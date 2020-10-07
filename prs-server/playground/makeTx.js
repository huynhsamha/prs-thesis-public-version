require('dotenv').config();

const Web3 = require('web3');
const config = require('./config');
const moment = require('moment');

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

const contractAddress = '0x589***b612';

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

/**
 * Call method `makeTransaction()` from smart contract
 * Will send a transaction to the smart contract and execute its method.
 * Note this can alter the smart contract state.
 * @param {contractAddress}: the address of contract, example such as `demoPRSContractAddress`
 */
const makeTransaction = ({ contractAddress, payload }) => new Promise(async (resolve, reject) => {
  try {
    const utils = web3.utils;
    // const utils = Web3.default.utils;

    const {
      feedbackId,
      email,
      sessionId,
      answerHash,
      feedbackTimestamp
    } = payload;

    const _feedbackId = utils.fromAscii(feedbackId);
    const _email = utils.fromAscii(email);
    const _sessionId = utils.fromAscii(sessionId);
    const _answerHash = utils.fromAscii(answerHash);
    const _feedbackTimestamp = feedbackTimestamp;

    const PRSContract = new web3.eth.Contract(abi, contractAddress);

    const txInstance = PRSContract.methods.sendFeedback(
      _feedbackId,
      _email,
      _sessionId,
      _answerHash,
      _feedbackTimestamp
    );

    // TODO: estimate gas is not working here
    // const gasLimit = await txInstance.estimateGas();
    const gasLimit = web3.utils.toHex(1e6);
    console.log('Gas limit:', gasLimit);

    const address = web3.eth.defaultAccount;

    console.log('Address:', address);

    // get Nonce with option pending, for handle parallel request
    const nonce = await web3.eth.getTransactionCount(address, 'pending');
    console.log('Nonce:', nonce);

    txInstance.send({
      from: address,
      gas: gasLimit,
      gasPrice,
      nonce
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

  const payload = {
    feedbackId: '5ece117bb7ca8e2373039c84',
    email: 'huynhha12798@gmail.com',
    sessionId: '5ecdc79a5ef77010a66784d8',
    answerHash: '580a8b54bb7476d5191c7ef44a236590',
    feedbackTimestamp: 1590563195350
  };

  makeTransaction({ contractAddress, payload }).then(({ txHash }) => {
    console.log(txHash);

  }).catch((err) => {
    console.log(err);
  });

}, 1000);
