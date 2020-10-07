const common = require('../utils/common');
const sessionServices = require('../services/session.service');
const fbService = require('../services/feedback.service');
const pollServices = require('../services/poll.service');
const crypto = require('crypto');

const secret = require('../config').session.secret;

const listAll = (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const query = { userID };
  sessionServices.listAllSessions(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const listActive = (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const query = { userID };
  sessionServices.listActiveSessions(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const listWaiting = (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const query = { userID };
  sessionServices.listWaitingSessions(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

const listComplete = (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const query = { userID };
  sessionServices.listCompleteSessions(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });
};

/**
 * Create new in-active session from poll
 */
const create = async (req, res, next) => {
  const { payload } = req.session;
  const { userID, storageID } = payload;
  const { pollID, title, activeTime, finishTime, isPublic, password, allowBlockchain } = req.body;
  if (common.isNull(pollID, title, activeTime, finishTime)) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  const _activeTime = new Date(activeTime).getTime();
  const _finishTime = new Date(finishTime).getTime();
  if (_activeTime >= _finishTime) {
    return res.status(400).json({ error: 'Thời gian bắt đầu cần phải nhỏ hơn thời gian kết thúc' });
  }
  if (_activeTime <= Date.now()) {
    return res.status(400).json({ error: 'Thời gian bắt đầu phải sau thời điểm hiện tại' });
  }
  const code = await sessionServices.getUniqueCode(userID);
  const usePassword = password != null && password != '';
  const query = {
    pollID,
    editorID: userID,
    title,
    activeTime,
    finishTime,
    code,
    isPublic,
    usePassword,
    allowBlockchain: allowBlockchain != 'false', // default is true
    password: usePassword ? crypto.createHmac('sha256', secret).update(password || '').digest('hex') : null
  };
  sessionServices.createSessionService(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({
      message: 'Create session successfully',
      data
    });
  });
};

const edit = function (req, res, next) {
  const { sessionID, pollID, title, activeTime, finishTime, isPublic, password, allowBlockchain } = req.body;
  if (common.isNull(pollID, title, activeTime, finishTime)) {
    return res.status(400).json({ error: 'Invalid paramters' });
  }
  const _activeTime = new Date(activeTime).getTime();
  const _finishTime = new Date(finishTime).getTime();
  if (_activeTime >= _finishTime) {
    return res.status(400).json({ error: 'Thời gian bắt đầu cần phải nhỏ hơn thời gian kết thúc' });
  }
  if (_activeTime <= Date.now()) {
    return res.status(400).json({ error: 'Thời gian bắt đầu phải sau thời điểm hiện tại' });
  }
  const usePassword = password != null && password != '';
  const query = {
    sessionID,
    pollID,
    title,
    activeTime,
    finishTime,
    type: isPublic ? 'public' : 'private',
    usePassword,
    allowBlockchain: allowBlockchain != 'false', // default is true
    password: usePassword ? crypto.createHmac('sha256', secret).update(password || '').digest('hex') : null
  };
  sessionServices.editSessionService(query, (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).send();
  });
};

const findOne = function (req, res, next) {
  const { sessionID } = req.params;
  if (!sessionID) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const query = {
    sessionID
  };
  sessionServices.findOne(query, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data });
  });

};

const findPollBySession = function (req, res, next) {
  const { sessionID, pollID } = req.params;
  if (!sessionID || !pollID) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const querySession = {
    sessionID
  };
  sessionServices.findOne(querySession, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const queryPoll = {
      pollID
    };
    pollServices.getOnePollService(queryPoll, (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(200).json({ data });
    });
  });

};


const remove = function (req, res, next) {
  const { sessionID } = req.params;
  if (!sessionID) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  const query = {
    sessionID
  };
  sessionServices.remove(query, (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).send();
  });
};

const findByCode = async (req, res, next) => {
  const { code } = req.params;
  sessionServices.findByCode(code, (err, _data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const data = _data.toObject();
    delete data.password;
    res.status(200).json({ data });
  });
};

const findPollBySessionRequirePassword = function (req, res, next) {
  const { sessionID, pollID } = req.params;
  const { password } = req.body;
  if (!sessionID || !pollID) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  const querySession = {
    sessionID
  };
  sessionServices.findOne(querySession, (err, _data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const data = _data.toObject();
    if (data.type == 'private' && data.usePassword == true) {
      if (!password) {
        return res.status(400).json({ error: 'Cannot access session without password' });
      }
      const pwd = crypto.createHmac('sha256', secret).update(password || '').digest('hex');
      if (pwd != data.password) {
        return res.status(400).json({ error: 'Password is incorrect to access session' });
      }
    }
    const queryPoll = {
      pollID
    };
    pollServices.getOnePollService(queryPoll, (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(200).json({ data });
    });
  });
};

const verifyOwnerSession = async (req, res, next) => {
  const { payload } = req.session;
  const { userID } = payload;
  const { sessionId } = req.params;
  try {
    const session = await sessionServices.Instance.queryDBById(sessionId);
    if (!session) {
      return res.status(400).send({ errorMessage: 'Session not found' });
    }
    if (session.editorID != userID) {
      return res.status(400).send({ errorMessage: 'Not owner' });
    }
    return next();
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const getAllOpenSession = async function (req, res, next) {
  const query = req.session;
  // const page = query.page;
  // const perPage = query.perPage;
  const page = 0;
  const perPage = 6;

  // find some way to sort
  const data = await sessionServices.getAllOpen(query);
  if (!data) return res.status(500).json({ error: 'Cannot get data' });
  res.status(200).json({ data: data.slice(perPage * page, perPage * (page + 1)) });
};

const getHistorySessions = async function (req, res, next) {
  const { payload } = req.session;
  const { userID } = payload;
  try {
    const data = await fbService.Instance.Instance.find({ owner: userID }).populate('sessionId');
    const p = [...(data || [])].map((d) => {
      const session = d.sessionId.toObject();
      delete session.password;
      session.feedbackAt = d.createdAt;
      return session;
    });
    res.status(200).send(p);

  } catch (err) {
    console.log(err);
    return res.status(500).send('Error');
  }
};

const mapListSessions = (data = []) => data.map((d) => {
  const o = d.toObject();
  delete o.password;
  return o;
});

const getUpcommingPublicSession = async function (req, res, next) {
  try {
    const data = await sessionServices.Instance.queryDB({
      type: 'public',
      activeTime: {
        $gt: Date.now()
      }
    });
    res.status(200).json(mapListSessions(data));

  } catch (err) {
    console.log(err);
    return res.status(500).send('Error');
  }
};

const getActivePublicSession = async function (req, res, next) {
  try {
    const data = await sessionServices.Instance.queryDB({
      type: 'public',
      activeTime: {
        $lte: Date.now()
      },
      finishTime: {
        $gt: Date.now()
      }
    });
    res.status(200).json(mapListSessions(data));

  } catch (err) {
    console.log(err);
    return res.status(500).send('Error');
  }
};

module.exports = {
  listAll,
  listWaiting,
  listActive,
  listComplete,
  create,
  edit,
  findOne,
  findByCode,
  remove,
  findPollBySession,
  verifyOwnerSession,
  getAllOpenSession,
  getUpcommingPublicSession,
  getActivePublicSession,
  findPollBySessionRequirePassword,
  getHistorySessions
};

