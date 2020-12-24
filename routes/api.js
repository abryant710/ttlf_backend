const express = require('express');

const {
  getApi,
} = require('../controlllers/api');

const router = express.Router();
router.get('/', getApi);

module.exports = router;
