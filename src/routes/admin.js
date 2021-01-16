const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { checkOrigin } = require('../middleware/originCheck');

const {
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
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkOrigin, checkAuth, getConfig);
router.get('/config/manage-media', checkOrigin, checkAuth, getManageMedia);
router.get('/config/create-media', checkOrigin, checkAuth, getCreateMedia);
router.get('/config/update-media', checkOrigin, checkAuth, getUpdateMedia);
router.get('/config/create-schedule', checkOrigin, checkAuth, getCreateSchedule);
router.get('/config/manage-schedule', checkOrigin, checkAuth, getManageSchedule);
router.get('/config/manage-events', checkOrigin, checkAuth, getManageEvents);
router.get('/config/manage-bios', checkOrigin, checkAuth, getManageBios);
router.get('/config/create-bio', checkOrigin, checkAuth, getCreateBio);
router.patch('/config/patch-boolean', checkOrigin, checkAuth, patchBoolean);
router.post('/config/update-live-dj', checkOrigin, checkAuth, postUpdateLiveDj);
router.post('/config/create-media', checkOrigin, checkAuth, postCreateMedia);
router.post('/config/update-media', checkOrigin, checkAuth, postUpdateMedia);
router.post('/config/create-schedule', checkOrigin, checkAuth, postCreateSchedule);
router.post('/config/update-event', checkOrigin, checkAuth, postUpdateEvent);
router.post('/config/create-bio', checkOrigin, checkAuth, postCreateBio);
router.post('/config/update-bio', checkOrigin, checkAuth, postUpdateBio);
router.delete('/config/delete-track/:itemId', checkOrigin, checkAuth, deleteMedia);
router.delete('/config/delete-video/:itemId', checkOrigin, checkAuth, deleteMedia);
router.delete('/config/delete-schedule/:itemId', checkOrigin, checkAuth, deleteSchedule);
router.delete('/config/delete-bio/:itemId', checkOrigin, checkAuth, deleteBio);

module.exports = router;
