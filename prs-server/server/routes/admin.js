const express = require('express');

const adminCtrl = require('../controllers/admin');

const router = express.Router();

router.post('/login', adminCtrl.login);

router.get('/auth/verify', adminCtrl.verifyAdminSession, (req, res) => {
  res.status(200).send({ message: 'Success' });
});

/**
 * Check authen
 */
router.use(adminCtrl.verifyAdminSession);

/**
 * Autheticated
 */
router.get('/editor', adminCtrl.getAllEditor);
router.get('/audience', adminCtrl.getAllAudience);
router.get('/audience/active', adminCtrl.getActiveAudience);
router.get('/audience/disable', adminCtrl.getBanAudience);

router.post('/editor', adminCtrl.createEditor);

router.post('/audience/:userId/disable', adminCtrl.disableAudience);
router.post('/audience/:userId/enable', adminCtrl.enableAudience);
router.post('/audience/:userId/delete', adminCtrl.deleteAudience);

router.post('/audience', adminCtrl.createAudience);

router.get('/logout', adminCtrl.logout);

module.exports = router;
