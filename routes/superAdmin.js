const express = require('express');
const { checkSuperAdmin } = require('../middleware/auth');

const {
  getCreateAdmin,
  postCreateAdmin,
} = require('../controllers/superAdmin');

const router = express.Router();
router.get('/config/create-admin', checkSuperAdmin, getCreateAdmin);
router.post('/config/create-admin', checkSuperAdmin, postCreateAdmin);

module.exports = router;
