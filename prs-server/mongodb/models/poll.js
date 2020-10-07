const Joi = require('joi');
const mongoose = require('mongoose');

const cfg = require('./conf');
const QuestionSchema = require('./question').Schema;

const dbName = cfg.collections.Poll;

const surveyOrQuiz = ['quiz', 'survey'];
const quickOrFull = ['quick', 'full'];

const fields = {
  title: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Editor
  },
  surveyOrQuiz: {
    type: String,
    enum: surveyOrQuiz
  },
  quickOrFull: {
    type: String,
    enum: quickOrFull
  },
  questions: [QuestionSchema]
};

const schema = new mongoose.Schema(fields, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
});
const pollModel = mongoose.model(dbName, schema);

const parseData = raw => ({
  title: raw.title,
  owner: raw.owner,
  surveyOrQuiz: raw.surveyOrQuiz,
  quickOrFull: raw.quickOrFull,
  questions: raw.questions
});

const pollValidate = (poll) => {
  const data = parseData(poll);

  const { error } = Joi.validate(data, {
    title: Joi.string().required(),
    owner: Joi.any(),
    surveyOrQuiz: Joi.string().valid(surveyOrQuiz).required(),
    quickOrFull: Joi.string().valid(quickOrFull).required(),
    questions: Joi.array().required()
  });

  if (error) {
    return null;
  }
  return data;
};

exports.Model = pollModel;
exports.validate = pollValidate;
exports.fields = fields;
