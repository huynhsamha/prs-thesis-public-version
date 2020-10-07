const common = require('../utils/common');
const feedbackService = require('../services/feedback.service');
const sessionService = require('../services/session.service');
const sessionSocket = require('../socket/session');
const crypto = require('crypto');
const { transactionDB } = require('../../mongodb/operation');

const secret = require('../config').session.secret;

const findSession = async sessionId => new Promise((resolve, reject) => {
  sessionService.findOne({ sessionID: sessionId }, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const checkSessionOwner = async ({ sessionId, ownerId }) => new Promise((resolve, reject) => {
  sessionService.findOne({ sessionID: sessionId }, (err, data) => {
    if (err) {
      reject(err);
    } else if (data.editorID != ownerId) {
      reject(new Error('Not owner'));
    } else {
      resolve(data);
    }
  });
});

const guestCreateFeedback = async (req, res, next) => {
  const { sessionId } = req.params;
  const { answers } = req.body;
  if (common.isNull(sessionId, answers)) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    const session = await findSession(sessionId);
    const query = {
      sessionId,
      owner: null,
      isGuest: true,
      answers
    };
    feedbackService.createFeedback(query, (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(200).json({
        message: 'Create successfully'
      });
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const ownerGetFeedback = async (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const { sessionId } = req.params;
  const { answers } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    const session = await checkSessionOwner({ sessionId, ownerId: userID });
    feedbackService.getFeedbackOfSession({ sessionId }, (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(200).json(data);
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const ownerCountFeedback = async (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const { sessionId } = req.params;
  const { answers } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    const session = await checkSessionOwner({ sessionId, ownerId: userID });
    feedbackService.countFeedbackOfSession({ sessionId }, (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(200).json(data);
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const audienceCreateFeedback = async (req, res, next) => {
  const { sessionId } = req.params;
  const { answers, password, storeOnBlockchain } = req.body;
  const { payload } = req.session;
  const { userID, user } = payload;
  if (common.isNull(sessionId, answers)) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    const session = await findSession(sessionId);
    if (!session) {
      return res.status(400).send({ errorMessage: 'Session is invalid' });
    }
    if (session.type == 'private' && session.usePassword == true) {
      if (!password) {
        return res.status(400).json({ error: 'Cannot create feedback on the session without password' });
      }
      const pwd = crypto.createHmac('sha256', secret).update(password || '').digest('hex');
      if (pwd != session.password) {
        return res.status(400).json({ error: 'Password is incorrect to create feedback on the session' });
      }
    }
    const query = {
      sessionId,
      owner: userID,
      isGuest: false,
      answers
    };
    const createRes = await feedbackService.createFeedback(query);
    if (!createRes) {
      return res.status(400).json({ error: 'Fail to create feedback' });
    }

    // store on blockchain
    let blockchainData;
    if (storeOnBlockchain && session.allowBlockchain) {
      // console.log(createRes._doc);
      const { _id, answers } = createRes._doc;
      blockchainData = await feedbackService.storeTransaction({ email: user.email, feedbackId: _id, answers, session });
    }

    const feedback = createRes.toObject();
    feedback.owner = user;
    sessionSocket.sendData(sessionId, sessionSocket.msg.newFeedback, { feedback });

    res.status(200).json({
      message: 'Create successfully',
      blockchain: blockchainData,
      feedbackId: createRes._id
    });
  } catch (err) {
    console.error('Error when creating feedback', err);
    return res.status(400).json({ error: err });
  }
};

const mwCheckAudienceSentFeedback = async (req, res, next) => {
  const { sessionId } = req.params;
  const { payload } = req.session;
  const { userID } = payload;
  feedbackService.Instance.queryDBOne({ sessionId, owner: userID })
    .then((record) => {
      if (record != null) {
        res.status(400).send({ errorMessage: 'User has sent feedback on this session' });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const getAudienceFeedbackOfSession = async (req, res, next) => {
  const { sessionId } = req.params;
  const { payload } = req.session;
  const { userID } = payload;
  feedbackService.Instance.queryDBOne({ sessionId, owner: userID })
    .then(record => res.status(200).send({ data: record }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const getAudienceFeedbackOfSessionWithTransaction = async (req, res, next) => {
  const { sessionId } = req.params;
  const { payload } = req.session;
  const { userID } = payload;
  feedbackService.Instance.queryDBOne({ sessionId, owner: userID })
    .then(async (record) => {
      if (!record) return record;
      // console.log(record);
      const feedbackId = record._id;
      const tx = await transactionDB.queryDBOne({ feedbackID: feedbackId });
      // console.log(tx);
      return {
        ...record.toObject(),
        eth: tx
      };
    })
    .then(record => res.status(200).send({ data: record }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const getFeedbackOfSession = async (req, res, next) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    const data = await feedbackService.Instance.Instance.find({ sessionId });
    res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const getFeedbackOfSessionWithUserInfo = async (req, res, next) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  try {
    const data = await feedbackService.Instance.Instance.find({ sessionId }).populate('owner');
    res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

const updateBlockchainData = async function (req, res, next) {
  const { transactionId } = req.params;
  const { hashId, blockId } = req.body;

  if (!transactionId) res.status(400).json({ error: 'Cannot find transaction' });
  const valid = (!!hashId && !!blockId);
  const error = await feedbackService.updateTransaction(transactionId, { hashId, blockId, valid });

  if (error) return res.status(500).json({ error: `Something went wrong while update blockchain data: ${error}` });
  res.status(200).end();
};

module.exports = {
  guestCreateFeedback,
  ownerCountFeedback,
  ownerGetFeedback,
  audienceCreateFeedback,
  getAudienceFeedbackOfSession,
  getAudienceFeedbackOfSessionWithTransaction,
  mwCheckAudienceSentFeedback,
  getFeedbackOfSessionWithUserInfo,
  getFeedbackOfSession,
  updateBlockchainData
};

