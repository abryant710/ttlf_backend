const express = require('express');

const {
  getCreateAdmin,
  postCreateAdmin,
} = require('../controllers/superAdmin');

const router = express.Router();
router.get('/create-admin', getCreateAdmin);
router.post('/create-admin', postCreateAdmin);

module.exports = router;
