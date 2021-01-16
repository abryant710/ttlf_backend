const express = require('express');
const { checkOrigin } = require('../middleware/originCheck');

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
router.get('/login', checkOrigin, getLogin);
router.post('/login', checkOrigin, postLogin);
router.post('/logout', checkOrigin, deleteSession);
router.get('/send-reset', checkOrigin, getSendReset);
router.post('/send-reset', checkOrigin, postSendReset);
router.get('/reset-password', checkOrigin, getResetPassword);
router.post('/reset-password', checkOrigin, postResetPassword);

module.exports = router;
