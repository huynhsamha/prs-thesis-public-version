const Joi = require('joi');
const mongoose = require('mongoose');

const cfg = require('./conf');

const dbName = cfg.collections.Session;

const fields = {
  pollID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Poll
  },
  editorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Editor
  },
  code: String,
  url: String,
  title: String,
  result: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cfg.collections.Result
  },
  activeTime: Date,
  finishTime: Date,
  type: {
    type: String,
    enum: ['public', 'private']
    // public: password = null, usePassword = false (as default)
    // private: use `password` and `usePassword`
  },
  password: {
    type: String,
    default: null
  },
  usePassword: {
    type: Boolean,
    default: false
  },
  allowBlockchain: {
    type: Boolean,
    default: true
  },
  cnpm: String
};

const schema = new mongoose.Schema(fields, {
  collection: cfg.toCollectionName(dbName),
  timestamps: cfg.timestamps
});
const sessionModel = mongoose.model(dbName, schema);

const sessionValidate = (session) => {
  session.type = session.isPublic ? 'public' : 'private';
  if (session.isPublic) {
    session.usePassword = false;
    session.password = null;
  }
  if (!session.usePassword) {
    session.usePassword = false;
    session.password = null;
  }
  delete session.isPublic;

  const { error } = Joi.validate(session, {
    type: Joi.string().required(),
    pollID: Joi.any(),
    editorID: Joi.any(),
    code: Joi.any(),
    url: Joi.string(),
    title: Joi.string().required(),
    activeTime: Joi.date(),
    finishTime: Joi.date(),
    result: Joi.any(),
    password: session.password,
    usePassword: session.usePassword,
    allowBlockchain: session.allowBlockchain
  });

  if (error) {
    console.error('Error validate session', error);
    return null;
  }
  return session;
};

exports.Model = sessionModel;
exports.validate = sessionValidate;
exports.fields = fields;
