const mongoose = require('mongoose');
const cfg = require('./conf');

const dbName = cfg.collections.Transaction;

const model = mongoose.model(dbName, new mongoose.Schema({
  hashID: {
    type: String,
    default: 'Updating'
  },
  blockID: {
    type: String,
    default: 'Updating'
  },
  feedbackID: mongoose.Types.ObjectId,
  rawContent: String,
  hashContent: String,
  smartcontractAddress: String,
  valid: {
    type: Boolean,
    default: false
  }
}, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
}));

const validate = data => data;

exports.Model = model;
exports.validate = validate;
