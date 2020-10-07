const audienceDB = require('./audience');
const editorDB = require('./editor');
const pollDB = require('./poll');
const pollStorageDB = require('./pollStorage');
const sessionDB = require('./session');
const feedbackDB = require('./feedback');
const transactionDB = require('./transaction');

module.exports = {
  audienceDB,
  editorDB,
  pollDB,
  pollStorageDB,
  sessionDB,
  feedbackDB,
  transactionDB
};
