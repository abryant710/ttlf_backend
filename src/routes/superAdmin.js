import express from 'express';
import { checkSuperAdmin } from '../middleware/auth.js';
import { adminOrigin } from '../middleware/originCheck.js';

import {
  initialiseData,
  getManageAdmins,
  getCreateAdmin,
  postCreateAdmin,
  deleteAdmin,
} from '../controllers/superAdmin.js';

const router = express.Router();
router.get('/config/initialise', adminOrigin, checkSuperAdmin, initialiseData); // Only used to import data initially
router.get('/config/manage-admins', adminOrigin, checkSuperAdmin, getManageAdmins);
router.get('/config/create-admin', adminOrigin, checkSuperAdmin, getCreateAdmin);
router.post('/config/create-admin', adminOrigin, checkSuperAdmin, postCreateAdmin);
router.delete('/config/delete-admin/:itemId', adminOrigin, checkSuperAdmin, deleteAdmin);

export default router;
