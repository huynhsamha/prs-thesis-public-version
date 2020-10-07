const express = require('express');
const passport = require('passport');

const audienceController = require('../controllers/audience');
const sessionController = require('../controllers/session');
const ethCtrl = require('../controllers/eth');
const googleOAuth = require('../strategies/google_audience');
const config = require('../config');

const router = express.Router();

/**
 * Google OAuthen
 */
router.use(passport.initialize()); // Used to initialize passport
router.use(passport.session()); // Used to persist login sessions

googleOAuth.init();

router.get(
  '/auth/google',
  googleOAuth.storeRedirectUrl,
  passport.authenticate(googleOAuth.StrategyName, { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate(googleOAuth.StrategyName, { failureRedirect: `${config.audienceUrl}/login` }),
  googleOAuth.handleSuccessLogin
);

/**
 * Check authen
 */
router.get('/verify', audienceController.verifyAudienceLogin, (req, res) => {
  res.status(200).send({ msg: 'success' });
});

/**
 * Authen Middleware
 */
router.use(audienceController.verifyAudienceLogin);

/**
 * Autheticated
 */
router.get('/me', audienceController.getMyProfile);
router.get('/logout', audienceController.logoutAudience);

/**
 * Session routes
 */
router.get('/session/code/:code', sessionController.findByCode);
router.get('/session/open', sessionController.getAllOpenSession);
router.get('/session/open/upcoming', sessionController.getUpcommingPublicSession);
router.get('/session/open/active', sessionController.getActivePublicSession);
router.get('/session/history', sessionController.getHistorySessions);

router.post('/session/get/:sessionID/poll/:pollID', sessionController.findPollBySessionRequirePassword);

/**
 * Ethereum
 */
router.post('/eth/update', ethCtrl.updateAndSendEther);

module.exports = router;
