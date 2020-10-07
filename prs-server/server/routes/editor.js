const express = require('express');
const passport = require('passport');

const editorController = require('../controllers/editor');
const googleOAuth = require('../strategies/google_editor');
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
  passport.authenticate(googleOAuth.StrategyName, { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate(googleOAuth.StrategyName, { failureRedirect: `${config.editorUrl}/login` }),
  googleOAuth.handleSuccessLogin
);

/**
 * Check authen
 */
router.get('/verify', editorController.verifyEditorLogin, (req, res) => {
  res.status(200).send({ msg: 'success' });
});

/**
 * Authen Middleware
 */
router.use(editorController.verifyEditorLogin);

/**
 * Autheticated
 */
router.get('/me', editorController.getMyProfile);
router.get('/logout', editorController.logoutEditor);

module.exports = router;
