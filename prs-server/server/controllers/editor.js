const config = require('../config');
const sessionManager = require('../utils/session');

const verifyEditorLogin = (req, res, next) => {
  if (!sessionManager.validateEditorPayload(req.session.payload)) {
    return res.status(400).send({ errorMessage: 'Not allow' });
  }
  if (req.session.payload.user.disable) {
    return res.status(401).send({ errorMessage: 'Tài khoản này không được cấp quyền truy cập. Vui lòng sử dụng tài khoản hcmut.edu.vn hoặc liên hệ người chịu trách nhiệm.' });
  }
  return next();
};

const logoutEditor = (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie(config.cookie.sessionId);
    res.status(200).send({ message: 'Success' });
  });
};

const getMyProfile = (req, res) => {
  res.status(200).send(req.session.payload.user);
};

module.exports = {
  verifyEditorLogin,
  logoutEditor,
  getMyProfile
};
