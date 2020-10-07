const express = require('express');

const pollController = require('../controllers/poll');
const editorController = require('../controllers/editor');

const router = express.Router();

router.use(editorController.verifyEditorLogin);

router.get('/mypoll', pollController.getAllMyPoll);
router.get('/mypoll/quiz', pollController.getQuizMyPoll);
router.get('/mypoll/survey', pollController.getSurveyMyPoll);
router.get('/mypoll/get/:pollID', pollController.getOnePoll);

router.post('/mypoll/create', pollController.createPoll);
router.post('/mypoll/update', pollController.updatePoll);


module.exports = router;
