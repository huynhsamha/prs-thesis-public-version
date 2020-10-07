const { audienceDB } = require('../../mongodb/operation');
const Web3 = require('web3');
const config = require('../config');

const provider = config.eth.provider;
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
const gasPrice = web3.utils.toHex(1e9);

const sendEtherInBackground = ({ address }) => new Promise(async (resolve, reject) => {
  try {
    const utils = web3.utils;
    // const utils = Web3.default.utils;

    const gasLimit = web3.utils.toHex(1e5);
    // console.log('Gas limit:', gasLimit);

    const srcAddress = web3.eth.defaultAccount;

    web3.eth.sendTransaction({
      from: srcAddress,
      to: address,
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


const initialize = () => {
  const privateKey = config.eth.ropstenPrivateKey;
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  web3.eth.accounts.wallet.add(account);

  /** Set the default account, used to `from` */
  web3.eth.defaultAccount = account.address;

  console.log('======================================');
  console.log(`ETH Provider: ${config.eth.provider}`);
  console.log(`ETH Account: ${account.address}`);
  console.log('======================================');
};

module.exports = {
  initialize,
  sendEtherInBackground
};
