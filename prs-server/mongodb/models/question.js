const Joi = require('joi');
const mongoose = require('mongoose');

/**
 * Question: là sub-document trong Poll, không phải là 1 collection
 */

const qTypes = ['single', 'multiple', 'text'];

const fields = {
  type: {
    type: String,
    enum: qTypes
  },
  title: String,
  choices: [{
    id: Number,
    value: String,
    isCorrect: Boolean
  }]
};

const schema = new mongoose.Schema(fields);

const questionValidate = (question) => {

  const { error } = Joi.validate(question, {
    type: Joi.string().valid(qTypes).required(),
    title: Joi.string().required(),
    choices: Joi.array().required()
  });

  if (error) {
    return null;
  }
  return question;
};

exports.validate = questionValidate;
exports.fields = fields;
exports.Schema = schema;
