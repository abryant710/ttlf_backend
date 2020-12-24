const express = require('express');

const {
  getLogin,
  postLogin,
  getSendReset,
  postSendReset,
  getResetPassword,
  postResetPassword,
  getConfig,
} = require('../controllers/admin');

const router = express.Router();
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/send-reset', getSendReset);
router.post('/send-reset', postSendReset);
router.get('/reset-password', getResetPassword);
router.post('/reset-password', postResetPassword);
router.get('/config', getConfig);

module.exports = router;
