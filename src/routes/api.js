const express = require('express');
const { apiOrigin } = require('../middleware/originCheck');

const {
  getWebsiteConfig,
} = require('../controllers/api');

const router = express.Router();
router.get('/v1/siteConfig', apiOrigin, getWebsiteConfig);

module.exports = router;
