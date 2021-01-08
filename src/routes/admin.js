const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  postLiveNow,
  postUpdateLiveDj,
  getManageMedia,
  getCreateMedia,
  postCreateMedia,
  getUpdateMedia,
  postUpdateMedia,
  postRandomiseMedia,
  getManageBios,
  getCreateBio,
  postCreateBio,
  postUpdateBio,
  deleteMedia,
  deleteBio,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.post('/config/live-now', checkAuth, postLiveNow);
router.post('/config/update-live-dj', checkAuth, postUpdateLiveDj);
router.get('/config/manage-media', checkAuth, getManageMedia);
router.get('/config/create-media', checkAuth, getCreateMedia);
router.post('/config/create-media', checkAuth, postCreateMedia);
router.get('/config/update-media', checkAuth, getUpdateMedia);
router.post('/config/update-media', checkAuth, postUpdateMedia);
router.post('/config/randomise-media', checkAuth, postRandomiseMedia);
router.get('/config/manage-bios', checkAuth, getManageBios);
router.get('/config/create-bio', checkAuth, getCreateBio);
router.post('/config/update-bio', checkAuth, postUpdateBio);
router.post('/config/create-bio', checkAuth, postCreateBio);
router.delete('/config/delete-track/:itemId', checkAuth, deleteMedia);
router.delete('/config/delete-video/:itemId', checkAuth, deleteMedia);
router.delete('/config/delete-bio/:itemId', checkAuth, deleteBio);

module.exports = router;
