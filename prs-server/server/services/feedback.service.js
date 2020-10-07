const crypto = require('crypto');

const { UniqueNumber } = require('../utils/unique');

const { feedbackDB, transactionDB, pollDB } = require('../../mongodb/operation');

const smartContract = transactionDB.getSmartContractAddress();

const getMD5String = function (str) {
  const MD5sum = crypto.createHash('md5');
  MD5sum.update(str);
  return MD5sum.digest('hex');
};

const createFeedback = async (data) => {
  const res = await feedbackDB.addDB(data);
  return res;
};

const getFeedbackOfSession = async ({ sessionId }, callback) => {
  const data = await feedbackDB.queryDB({ sessionId });
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const countFeedbackOfSession = async ({ sessionId }, callback) => {
  const data = await feedbackDB.countDocumentsDB({ sessionId });
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const storeTransaction = async (feedbackData) => {
  // console.log(feedbackData);
  if (!feedbackData) return feedbackData;
  const { feedbackId, email, answers, session } = feedbackData;

  // get full poll data (questions)
  const rawContent = await pollDB.getFullAnswer({ email, answers, session });
  const md5sum = getMD5String(rawContent);

  // store feedback info first and will update transaction info later
  const txData = {
    feedbackID: feedbackId,
    rawContent,
    hashContent: md5sum,
    smartcontractAddress: smartContract
  };

  const res = await transactionDB.addDB(txData);
  if (!res) 'Something went wrong while create your transaction';

  return {
    txId: res._id,
    raw: rawContent,
    md5: md5sum,
    smartContract
  };
};

const updateTransaction = async function (id, rawData) {
  const data = await transactionDB.queryDBById(id);
  if (!data) {
    return 'Cannot find your transaction info';
  }
  await transactionDB.updateDB(id, {
    hashID: rawData.hashId,
    blockID: rawData.blockId,
    valid: rawData.vali
  });
  return null;
};

module.exports = {
  createFeedback,
  getFeedbackOfSession,
  countFeedbackOfSession,
  storeTransaction,
  updateTransaction,
  Instance: feedbackDB
};
