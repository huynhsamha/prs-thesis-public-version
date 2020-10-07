const path = require('path');

const { Model, validate } = require('../models/editor');

const basicOperation = require('./basic')(Model, validate);

module.exports = {
  ...basicOperation
};
