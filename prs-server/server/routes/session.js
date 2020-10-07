const express = require('express');

const editorController = require('../controllers/editor');
const sessionController = require('../controllers/session');

const router = express.Router();

router.use(editorController.verifyEditorLogin);

router.get('/code/:code', sessionController.findByCode);
router.get('/get/:sessionID/poll/:pollID', sessionController.findPollBySession);

router.get('/listAll', sessionController.listAll);
router.get('/listWaiting', sessionController.listWaiting);
router.get('/listActive', sessionController.listActive);
router.get('/listComplete', sessionController.listComplete);

// router.post('/active/:sessionID', sessionController.active);

router.get('/get/:sessionID', sessionController.findOne);

router.post('/create', sessionController.create);
router.post('/edit', sessionController.edit);
router.delete('/:sessionID', sessionController.remove);

module.exports = router;
