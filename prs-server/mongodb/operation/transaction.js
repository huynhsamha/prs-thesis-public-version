const path = require('path');

const dbPath = path.join(__dirname, '..', 'models', 'transaction');
const { Model, validate, fields } = require(dbPath);

const basicOperation = require('./basic')(Model, validate);

const getSmartContractAddress = function () {
  return process.env.SMARTCONTRACT_ADDRESS;
};

module.exports = {
  ...basicOperation,
  getSmartContractAddress
};
