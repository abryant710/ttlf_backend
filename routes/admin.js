const express = require('express');

const {
  getConfig,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config', getConfig);

module.exports = router;
