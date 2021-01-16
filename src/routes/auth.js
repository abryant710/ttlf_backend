import express from 'express';
import { adminOrigin } from '../middleware/originCheck.js';

import {
  getLogin,
  postLogin,
  deleteSession,
  getSendReset,
  postSendReset,
  getResetPassword,
  postResetPassword,
} from '../controllers/auth.js';

const router = express.Router();
router.get('/login', adminOrigin, getLogin);
router.post('/login', adminOrigin, postLogin);
router.post('/logout', adminOrigin, deleteSession);
router.get('/send-reset', adminOrigin, getSendReset);
router.post('/send-reset', adminOrigin, postSendReset);
router.get('/reset-password', adminOrigin, getResetPassword);
router.post('/reset-password', adminOrigin, postResetPassword);

export default router;
