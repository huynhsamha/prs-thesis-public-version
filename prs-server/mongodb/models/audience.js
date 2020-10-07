const mongoose = require('mongoose');
const cfg = require('./conf');

const dbName = cfg.collections.Audience;

const model = mongoose.model(dbName, new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    lowercase: true
  },
  displayName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  googleId: {
    type: String
  },
  disable: {
    type: Boolean,
    default: false
  },
  address: {
    type: String
  },
  pkFileId: {
    type: String
  }
}, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
}));

const validate = data => data;

exports.Model = model;
exports.validate = validate;
