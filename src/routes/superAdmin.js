const express = require('express');
const { checkSuperAdmin } = require('../middleware/auth');
const { checkOrigin } = require('../middleware/originCheck');

const {
  initialiseData,
  getManageAdmins,
  getCreateAdmin,
  postCreateAdmin,
  deleteAdmin,
} = require('../controllers/superAdmin');

const router = express.Router();
router.get('/config/initialise', checkOrigin, checkSuperAdmin, initialiseData); // Only used to import data initially
router.get('/config/manage-admins', checkOrigin, checkSuperAdmin, getManageAdmins);
router.get('/config/create-admin', checkOrigin, checkSuperAdmin, getCreateAdmin);
router.post('/config/create-admin', checkOrigin, checkSuperAdmin, postCreateAdmin);
router.delete('/config/delete-admin/:itemId', checkOrigin, checkSuperAdmin, deleteAdmin);

module.exports = router;
