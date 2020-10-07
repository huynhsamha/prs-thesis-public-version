const path = require('path');

const { Model, validate } = require('../models/audience');

const basicOperation = require('./basic')(Model, validate);

module.exports = {
  ...basicOperation
};
