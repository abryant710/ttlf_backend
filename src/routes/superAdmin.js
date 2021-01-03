const express = require('express');
const { checkSuperAdmin } = require('../middleware/auth');

const {
  initialiseData,
  getManageAdmins,
  getCreateAdmin,
  postCreateAdmin,
  deleteAdmin,
} = require('../controllers/superAdmin');

const router = express.Router();
router.get('/config/initialise', checkSuperAdmin, initialiseData); // Only used to import data initially
router.get('/config/manage-admins', checkSuperAdmin, getManageAdmins);
router.get('/config/create-admin', checkSuperAdmin, getCreateAdmin);
router.post('/config/create-admin', checkSuperAdmin, postCreateAdmin);
router.post('/config/delete-admin', checkSuperAdmin, deleteAdmin);

module.exports = router;
