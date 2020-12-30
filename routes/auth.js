const express = require('express');

const {
  getLogin,
  postLogin,
  getSendReset,
  postSendReset,
  getResetPassword,
  postResetPassword,
} = require('../controllers/auth');

const router = express.Router();
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/send-reset', getSendReset);
router.post('/send-reset', postSendReset);
router.get('/reset-password', getResetPassword);
router.post('/reset-password', postResetPassword);

module.exports = router;
