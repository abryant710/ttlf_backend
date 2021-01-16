const express = require('express');
const { adminOrigin } = require('../middleware/originCheck');

const {
  getLogin,
  postLogin,
  deleteSession,
  getSendReset,
  postSendReset,
  getResetPassword,
  postResetPassword,
} = require('../controllers/auth');

const router = express.Router();
router.get('/login', adminOrigin, getLogin);
router.post('/login', adminOrigin, postLogin);
router.post('/logout', adminOrigin, deleteSession);
router.get('/send-reset', adminOrigin, getSendReset);
router.post('/send-reset', adminOrigin, postSendReset);
router.get('/reset-password', adminOrigin, getResetPassword);
router.post('/reset-password', adminOrigin, postResetPassword);

module.exports = router;
