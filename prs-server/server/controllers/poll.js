const path = require('path');

const pollServices = require('../services/poll.service');
const common = require('../utils/common');

const getAllMyPoll = function (req, res, next) {
  const { payload } = req.session;
  pollServices.getAllMyPollService(payload.storageID, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const getQuizMyPoll = function (req, res, next) {
  const { payload } = req.session;
  pollServices.getSurveyOrQuizMyPollService(payload.storageID, 'quiz', (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const getSurveyMyPoll = function (req, res, next) {
  const { payload } = req.session;
  pollServices.getSurveyOrQuizMyPollService(payload.storageID, 'survey', (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const getOnePoll = function (req, res, next) {
  const { pollID } = req.params;
  if (!pollID) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  const query = {
    pollID
  };
  pollServices.getOnePollService(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });

};

const createPoll = function (req, res, next) {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const { surveyOrQuiz, quickOrFull, questions, title } = req.body;
  if (common.isNull(userID, surveyOrQuiz, quickOrFull, questions, title, storageID)) {
    return res.status(400).json({
      status: 400,
      message: 'Request contain invalid data'
    });
  }

  if (surveyOrQuiz !== 'quiz' && surveyOrQuiz !== 'survey') {
    return res.status(400).json({
      status: 400,
      message: 'Invalid type, only accept quiz or survey'
    });
  }

  const query = { owner: userID, storageID, ...req.body };
  pollServices.createPollService(query, storageID, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const updatePoll = function (req, res, next) {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const { pollID, surveyOrQuiz, quickOrFull, questions, title } = req.body;
  if (common.isNull(userID, surveyOrQuiz, quickOrFull, questions, title, storageID)) {
    return res.status(200).json({
      status: 200,
      message: 'Request contain invalid data'
    });
  }

  if (surveyOrQuiz !== 'quiz' && surveyOrQuiz !== 'survey') {
    return res.status(200).json({
      status: 200,
      message: 'Invalid type, only accept quiz or survey'
    });
  }

  if (quickOrFull !== 'quick' && quickOrFull !== 'full') {
    return res.status(200).json({
      status: 200,
      message: 'Invalid type, only accept quick or full'
    });
  }

  const query = { owner: userID, storageID, ...req.body };
  pollServices.updatePollService(query, pollID, (err, data) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    res.status(200).json({ message: 'Update successfully' });
  });
};

module.exports = {
  getAllMyPoll,
  getQuizMyPoll,
  getSurveyMyPoll,
  getOnePoll,
  createPoll,
  updatePoll
};
