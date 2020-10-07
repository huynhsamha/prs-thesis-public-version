const path = require('path');

const dbPath = path.join(__dirname, '..', 'models', 'pollStorage');
const { Model, validate, fields } = require(dbPath);

const basicOperation = require('./basic')(Model, validate);

const newStorage = async function () {
  const init = {
    own: [],
    shared: []
  };
  const data = await basicOperation.addDB(init);
  if (!data) return null;
  return data._id;
};

const getStorages = function (storageID) {
  return basicOperation.queryDBById(storageID)
    .select('own shared');
};

const getOwnStorage = function (storageID) {
  return basicOperation.queryDBById(storageID)
    .select('own');
};

const getSharedStorage = function (storageID) {
  return basicOperation.queryDBById(storageID)
    .select('shared');
};

const addPollToStorage = async function (storageID, pollID) {
  const data = await basicOperation.queryDBById(storageID).select('own');
  const newdata = [...data.own, pollID];
  return basicOperation.updateDB(storageID, { own: newdata });
};

module.exports = {
  ...basicOperation,
  newStorage,
  getStorages,
  getOwnStorage,
  getSharedStorage,
  addPollToStorage
};
