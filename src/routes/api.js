const express = require('express');

const {
  getWebsiteConfig,
} = require('../controllers/api');

const router = express.Router();
router.get('/v1/siteConfig', getWebsiteConfig);

module.exports = router;
