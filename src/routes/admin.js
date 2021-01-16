import express from 'express';
import { checkAuth } from '../middleware/auth.js';
import { adminOrigin } from '../middleware/originCheck.js';

import {
  getConfig,
  getManageMedia,
  getCreateMedia,
  getUpdateMedia,
  getManageSchedule,
  getManageEvents,
  getCreateSchedule,
  getManageBios,
  getCreateBio,
  patchBoolean,
  postUpdateLiveDj,
  postCreateMedia,
  postUpdateMedia,
  postCreateSchedule,
  postUpdateEvent,
  postCreateBio,
  postUpdateBio,
  deleteMedia,
  deleteSchedule,
  deleteBio,
} from '../controllers/admin.js';

const router = express.Router();
router.get('/config/live', adminOrigin, checkAuth, getConfig);
router.get('/config/manage-media', adminOrigin, checkAuth, getManageMedia);
router.get('/config/create-media', adminOrigin, checkAuth, getCreateMedia);
router.get('/config/update-media', adminOrigin, checkAuth, getUpdateMedia);
router.get('/config/create-schedule', adminOrigin, checkAuth, getCreateSchedule);
router.get('/config/manage-schedule', adminOrigin, checkAuth, getManageSchedule);
router.get('/config/manage-events', adminOrigin, checkAuth, getManageEvents);
router.get('/config/manage-bios', adminOrigin, checkAuth, getManageBios);
router.get('/config/create-bio', adminOrigin, checkAuth, getCreateBio);
router.patch('/config/patch-boolean', adminOrigin, checkAuth, patchBoolean);
router.post('/config/update-live-dj', adminOrigin, checkAuth, postUpdateLiveDj);
router.post('/config/create-media', adminOrigin, checkAuth, postCreateMedia);
router.post('/config/update-media', adminOrigin, checkAuth, postUpdateMedia);
router.post('/config/create-schedule', adminOrigin, checkAuth, postCreateSchedule);
router.post('/config/update-event', adminOrigin, checkAuth, postUpdateEvent);
router.post('/config/create-bio', adminOrigin, checkAuth, postCreateBio);
router.post('/config/update-bio', adminOrigin, checkAuth, postUpdateBio);
router.delete('/config/delete-track/:itemId', adminOrigin, checkAuth, deleteMedia);
router.delete('/config/delete-video/:itemId', adminOrigin, checkAuth, deleteMedia);
router.delete('/config/delete-schedule/:itemId', adminOrigin, checkAuth, deleteSchedule);
router.delete('/config/delete-bio/:itemId', adminOrigin, checkAuth, deleteBio);

export default router;
