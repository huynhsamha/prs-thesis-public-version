const path = require('path');
const mongoose = require('mongoose');

const dbPath = path.join(__dirname, '..', 'models', 'poll');
const { Model, validate, fields } = require(dbPath);

const basicOperation = require('./basic')(Model, validate);

const getListPolls = async function (list) {
  return Promise.all(list.map(async (pollID) => {
    const obj = await basicOperation.queryDBById(pollID);
    return obj;
  }));
};

const getListSurveyOrQuizPolls = async function (list, surveyOrQuiz) {
  if (surveyOrQuiz !== 'quiz' && surveyOrQuiz !== 'survey') {
    return null;
  }

  return Promise.all(list.map(async (item) => {
    const obj = await basicOperation.queryDBById(item);
    if (obj.surveyOrQuiz === surveyOrQuiz) {
      return obj;
    }
    return null;
  }));

};

const getFullAnswer = async function ({ email, answers, session }) {
  let feedbackStr = '';
  const poll = await Model.findById(session.pollID);
  const questions = poll.questions;

  feedbackStr += `[Email]:${email}--[Timestamp]:${Date.now()}`;
  feedbackStr += `--[Title]:${session.title}--[Content]:`;
  feedbackStr += questions.map((q, i) => {
    let e = `[Q_${i}]-"${q.title}"-[A]:`;
    const answer = answers[q._id];
    if (q.type === 'single') {
      const p = q.choices.filter(o => o.id == answer);
      if (p && p.length > 0) {
        e += p[0].value;
      }
    } else if (q.type === 'multiple') {
      e += `[${answer.map((val) => {
        const p = q.choices.filter(o => o.id == val);
        if (p && p.length > 0) {
          return p[0].value;
        }
        return null;
      })
        .filter(u => u != null)
        .join(',')}]`;
    } else if (q.type === 'text') {
      e += answer;
    }
    return e;
  }).join(';');

  return feedbackStr;
};

module.exports = {
  ...basicOperation,
  getListPolls,
  getListSurveyOrQuizPolls,
  getFullAnswer
};
