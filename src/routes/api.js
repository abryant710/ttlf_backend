const express = require('express');

const {
  getApi,
} = require('../controllers/api');

const router = express.Router();
router.get('/', getApi);

module.exports = router;
