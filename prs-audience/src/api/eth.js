const Web3 = require('web3');
const provider =
  'https://ropsten.infura.io/v3/0b650af2dfbe4ad5bade0975746397ac';
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
const PRSContractJSON = require('../assets/contracts/PRSContract.json');
const { abi, bytecode } = PRSContractJSON;
const gasPrice = web3.utils.toHex(1e9);

export const contractAddress = '0x5891b3a6ac6135a937f7198769bcf1be12eeb612';

export const configDefaultAccount = async ({ privateKey }) => {
  /**
   * Add to wallet, can use sendTransaction()
   * Dont have to sign to transaction manually
   */
  const account = web3.eth.accounts.privateKeyToAccount(`${privateKey}`);

  web3.eth.accounts.wallet.add(account);

  /** Set the default account, used to `from` */
  web3.eth.defaultAccount = account.address;
  console.log('Address:' + account.address);
  // test: 0x3Cb80eB94AFbC24ad02FFcbF997712c02D5E8b7D
};

export const createAccount = () => {
  const account = web3.eth.accounts.create();
  return account;
};

export const makeTransaction = ({
  feedbackId,
  email,
  sessionId,
  answerHash,
  feedbackTimestamp
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const utils = web3.utils;

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

      txInstance
        .send({
          from: address,
          gas: gasLimit,
          gasPrice,
          nonce
        })
        .on('transactionHash', txHash => {
          console.log('Transaction Hash: ', txHash);
          resolve({ txHash });
        })
        .on('error', err => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });

export const minimizeTxHash = (txHash = '') => {
  const maxLength = 32;
  const length = txHash.length;
  if (length <= maxLength) return txHash;
  const suff = txHash.slice(length - 8, length);
  return txHash.slice(0, maxLength - 8 - 3) + '...' + suff;
  // 0x1d98ab6a8aa2ae6d7492a6e79ffe3b3d7eefbe8110f92840539b350ff5ac5105
};
