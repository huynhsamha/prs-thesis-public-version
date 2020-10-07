const Joi = require('joi');
const mongoose = require('mongoose');

const cfg = require('./conf');

const dbName = cfg.collections.PollStorage;

const fields = {
  // danh sách các poll sở hữu
  own: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Poll
  }],
  // danh sách các poll được share
  shared: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Poll
  }]
};

const schema = new mongoose.Schema(fields, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
});
const pollStorageModel = mongoose.model(dbName, schema);

const parseData = raw => ({
  own: raw.own,
  shared: raw.shared
});

const pollStorageValidate = (storage) => {
  const data = parseData(storage);
  const { error } = Joi.validate(data, {
    own: Joi.array().required(),
    shared: Joi.array().required()
  });

  if (error) {
    return null;
  }
  return data;
};

exports.Model = pollStorageModel;
exports.validate = pollStorageValidate;
exports.fields = fields;
