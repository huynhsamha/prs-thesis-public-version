const { UniqueNumber } = require('../utils/unique');

const { sessionDB } = require('../../mongodb/operation');

const uniqueCodeSession = new UniqueNumber(6);

const initAvailableSessionCodes = async () => {
  try {
    const codes = await sessionDB.Instance.find().distinct('code');
    uniqueCodeSession.initValues(codes || []);

  } catch (err) {
    console.log(err);
  }
};

const createSessionService = async (sessionData, callback) => {
  const res = await sessionDB.addDB(sessionData);
  return callback(res ? null : 'Something went wrong', res);
};

const listAllSessions = async (query, callback) => {
  const { userID } = query;
  const data = await sessionDB.queryDB({ editorID: userID });
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const listActiveSessions = async (query, callback) => {
  const { userID } = query;
  const data = await sessionDB.queryDB({
    editorID: userID,
    activeTime: {
      $lte: Date.now()
    },
    finishTime: {
      $gt: Date.now()
    }
  });
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const listWaitingSessions = async (query, callback) => {
  const { userID } = query;
  const data = await sessionDB.queryDB({
    editorID: userID,
    activeTime: {
      $gt: Date.now()
    }
  });
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const listCompleteSessions = async (query, callback) => {
  const { userID } = query;
  const data = await sessionDB.queryDB({
    editorID: userID,
    finishTime: {
      $lte: Date.now()
    }
  });
  if (!data) {
    return callback('Something went wrong');
  }
  callback(null, data);
};

const getUniqueCode = (userID) => {
  const code = uniqueCodeSession.generate();
  return code;
};

const findOne = async (query, callback) => {
  const data = await sessionDB.queryDBById(query.sessionID);
  if (!data) {
    return callback('Cannot find session');
  }
  callback(null, data);
};

const findByCode = async (query, callback) => {
  const data = await sessionDB.queryDBOne({ code: query });
  if (!data) {
    return callback('Cannot find session');
  }
  // if (data.isComplete) {
  //   return callback('This session had ended');
  // }
  // if (!data.isActive) {
  //   return callback('This session have not started yet!');
  // }
  // if (data.isActive && Date.now() <= data.activeTime) {
  //   return callback(`This session will be start in ${new Date(data.activeTime).toLocaleDateString()}`);
  // }
  callback(null, data);
};

const editSessionService = async (query, callback) => {
  const data = await sessionDB.updateDB(query.sessionID, {
    title: query.title,
    pollID: query.pollID,
    activeTime: query.activeTime,
    finishTime: query.finishTime,
    type: query.type,
    usePassword: query.usePassword,
    allowBlockchain: query.allowBlockchain,
    password: query.password
  });
  if (!data) {
    return callback('Cannot update session');
  }
  return callback(null, data);
};

const getAllOpen = async (query) => {
  const data = await sessionDB.queryDB({ type: 'public' });
  return data;
};


module.exports = {
  createSessionService,
  editSessionService,
  listAllSessions,
  listWaitingSessions,
  listActiveSessions,
  listCompleteSessions,
  getUniqueCode,
  findOne,
  findByCode,
  Instance: sessionDB,
  getAllOpen,
  initAvailableSessionCodes
};
