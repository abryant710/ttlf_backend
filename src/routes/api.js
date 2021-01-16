const express = require('express');
const { checkOrigin } = require('../middleware/originCheck');

const {
  getWebsiteConfig,
} = require('../controllers/api');

const router = express.Router();
router.get('/v1/siteConfig', checkOrigin, getWebsiteConfig);

module.exports = router;
