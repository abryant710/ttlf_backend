const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config', checkAuth, getConfig);

module.exports = router;
