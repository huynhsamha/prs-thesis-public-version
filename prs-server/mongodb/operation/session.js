const path = require('path');

const dbPath = path.join(__dirname, '..', 'models', 'session');
const { Model, validate, fields } = require(dbPath);

const basicOperation = require('./basic')(Model, validate);

module.exports = {
  ...basicOperation
};
