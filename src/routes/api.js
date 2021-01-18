import express from 'express';
import { apiOrigin } from '../middleware/originCheck.js';

import {
  getWebsiteConfig,
  getLatestChat,
  postNewMessage,
} from '../controllers/api.js';

const router = express.Router();
router.get('/v1/siteConfig', apiOrigin, getWebsiteConfig);
router.get('/v1/latestChat', apiOrigin, getLatestChat);
router.post('/v1/postNewMessage', apiOrigin, postNewMessage);

export default router;
