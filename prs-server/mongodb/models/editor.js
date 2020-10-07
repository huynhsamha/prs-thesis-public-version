const mongoose = require('mongoose');
const cfg = require('./conf');

const dbName = cfg.collections.Editor;

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
    type: String,
    unique: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  pollStorageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.PollStorage
  }
}, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
}));

const validate = data => data;

exports.Model = model;
exports.validate = validate;
