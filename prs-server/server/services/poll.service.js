const path = require('path');
const _ = require('lodash');

const { pollStorageDB, pollDB } = require('../../mongodb/operation');

const getAllMyPollService = async function (storageID, callback) {
  const ownlist = await pollStorageDB.getOwnStorage(storageID);
  if (!ownlist) {
    return callback('Something went wrong');
  }
  const data = await pollDB.getListPolls(ownlist.own);
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const getSurveyOrQuizMyPollService = async function (storageID, surveyOrQuiz, callback) {
  const ownlist = await pollStorageDB.getOwnStorage(storageID);
  if (!ownlist) {
    return callback('Something went wrong');
  }
  const data = await pollDB.getListSurveyOrQuizPolls(ownlist.own, surveyOrQuiz);
  if (!data) {
    return callback('Something went wrong');
  }

  const res = _.filter(data, e => e != null);
  callback(null, res);
};

const createPollService = async function (pollData, storageID, callback) {
  const data = await pollDB.addDB(pollData);
  if (!data) {
    return callback('Something went wrong');
  }
  const response = await pollStorageDB.addPollToStorage(storageID, data._id);
  callback(null, response);
};

const getOnePollService = async (query, callback) => {
  const data = await pollDB.queryDBById(query.pollID);
  if (!data) {
    return callback('Cannot find poll');
  }
  callback(null, data);
};

/**
 * Update poll
 */
const updatePollService = async function (pollData, pollID, callback) {
  const res = await pollDB.updateDB(pollID, pollData);
  callback(null, res);
};

module.exports = {
  getAllMyPollService,
  getSurveyOrQuizMyPollService,
  createPollService,
  getOnePollService,
  updatePollService
};
