const express = require('express');

const sessionController = require('../controllers/session');
const feedbackController = require('../controllers/feedback');
const audienceController = require('../controllers/audience');
const editorController = require('../controllers/editor');

const router = express.Router();

router.post('/create/guest/session/:sessionId', feedbackController.guestCreateFeedback);

router.use('/a', audienceController.verifyAudienceLogin);
router.get('/a/get/session/:sessionId', feedbackController.getAudienceFeedbackOfSessionWithTransaction);
router.post('/a/create/session/:sessionId', feedbackController.mwCheckAudienceSentFeedback, feedbackController.audienceCreateFeedback);
router.post('/a/transaction/:transactionId', feedbackController.updateBlockchainData);

router.get('/get/session/:sessionId', feedbackController.ownerGetFeedback);
router.get('/count/session/:sessionId', feedbackController.ownerCountFeedback);

router.use('/o', editorController.verifyEditorLogin);
router.get('/o/session/:sessionId', sessionController.verifyOwnerSession, feedbackController.getFeedbackOfSession);
router.get('/o/session/:sessionId/userinfo', sessionController.verifyOwnerSession, feedbackController.getFeedbackOfSessionWithUserInfo);

module.exports = router;
