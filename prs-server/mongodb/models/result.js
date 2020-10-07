const Joi = require('joi');
const mongoose = require('mongoose');

const cfg = require('./conf');

/**
 * Result: là kết quả phân tích cho một session, sau khi session kết thúc
 * được tính từ các feedback
 */

const dbName = cfg.collections.Result;

const fields = {
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Session
  },
  totalFeedback: Number,
  totalGuestFeedback: Number
};

const schema = new mongoose.Schema(fields, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
});
const model = mongoose.model(dbName, schema);

const sessionValidate = (session) => {

  const { error } = Joi.validate(session, {
  });

  if (error) {
    return null;
  }
  return session;
};

exports.Model = model;
exports.validate = sessionValidate;
exports.fields = fields;
