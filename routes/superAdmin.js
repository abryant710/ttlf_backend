const express = require('express');

const {
  getCreateAdmin,
  postCreateAdmin,
} = require('../controllers/superAdmin');

const router = express.Router();
router.get('/config/create-admin', getCreateAdmin);
router.post('/config/create-admin', postCreateAdmin);

module.exports = router;
