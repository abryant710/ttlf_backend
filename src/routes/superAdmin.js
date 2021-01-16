const express = require('express');
const { checkSuperAdmin } = require('../middleware/auth');
const { adminOrigin } = require('../middleware/originCheck');

const {
  initialiseData,
  getManageAdmins,
  getCreateAdmin,
  postCreateAdmin,
  deleteAdmin,
} = require('../controllers/superAdmin');

const router = express.Router();
router.get('/config/initialise', adminOrigin, checkSuperAdmin, initialiseData); // Only used to import data initially
router.get('/config/manage-admins', adminOrigin, checkSuperAdmin, getManageAdmins);
router.get('/config/create-admin', adminOrigin, checkSuperAdmin, getCreateAdmin);
router.post('/config/create-admin', adminOrigin, checkSuperAdmin, postCreateAdmin);
router.delete('/config/delete-admin/:itemId', adminOrigin, checkSuperAdmin, deleteAdmin);

module.exports = router;
