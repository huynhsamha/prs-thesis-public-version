const Joi = require('joi');
const mongoose = require('mongoose');

const cfg = require('./conf');

/**
 * Feedback: 1 kết quả trả lời từ audience cho 1 session
 */

const dbName = cfg.collections.Feedback;

const fields = {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Audience
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Session
  },
  answers: Object, // { map questionId => answers }
  isGuest: Boolean
};

const schema = new mongoose.Schema(fields, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
});
const model = mongoose.model(dbName, schema);

const parseData = raw => ({
  owner: raw.owner,
  sessionId: raw.sessionId,
  isGuest: raw.isGuest,
  answers: raw.answers
});

const pollValidate = (poll) => {
  const data = parseData(poll);

  const { error } = Joi.validate(data, {
    owner: Joi.any(),
    sessionId: Joi.any(),
    answers: Joi.any(),
    isGuest: Joi.boolean()
  });

  if (error) {
    return null;
  }
  return data;
};

exports.Model = model;
exports.validate = pollValidate;
exports.fields = fields;
