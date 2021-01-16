import express from 'express';
import { apiOrigin } from '../middleware/originCheck.js';

import getWebsiteConfig from '../controllers/api.js';

const router = express.Router();
router.get('/v1/siteConfig', apiOrigin, getWebsiteConfig);

export default router;
