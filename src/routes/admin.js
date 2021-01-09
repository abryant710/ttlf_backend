const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getManageMedia,
  getCreateMedia,
  getUpdateMedia,
  getManageBios,
  getCreateBio,
  patchBoolean,
  postUpdateLiveDj,
  postCreateMedia,
  postUpdateMedia,
  postCreateBio,
  postUpdateBio,
  deleteMedia,
  deleteBio,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-media', checkAuth, getManageMedia);
router.get('/config/create-media', checkAuth, getCreateMedia);
router.get('/config/update-media', checkAuth, getUpdateMedia);
router.get('/config/manage-bios', checkAuth, getManageBios);
router.get('/config/create-bio', checkAuth, getCreateBio);
router.patch('/config/patch-boolean', checkAuth, patchBoolean);
router.post('/config/update-live-dj', checkAuth, postUpdateLiveDj);
router.post('/config/create-media', checkAuth, postCreateMedia);
router.post('/config/update-media', checkAuth, postUpdateMedia);
router.post('/config/create-bio', checkAuth, postCreateBio);
router.post('/config/update-bio', checkAuth, postUpdateBio);
router.delete('/config/delete-track/:itemId', checkAuth, deleteMedia);
router.delete('/config/delete-video/:itemId', checkAuth, deleteMedia);
router.delete('/config/delete-bio/:itemId', checkAuth, deleteBio);

module.exports = router;
