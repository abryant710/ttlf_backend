const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getManageMedia,
  getCreateMedia,
  postCreateMedia,
  getUpdateMedia,
  postUpdateMedia,
  deleteVideo,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-media', checkAuth, getManageMedia);
router.get('/config/create-media', checkAuth, getCreateMedia);
router.post('/config/create-media', checkAuth, postCreateMedia);
router.get('/config/update-media', checkAuth, getUpdateMedia);
router.post('/config/update-media', checkAuth, postUpdateMedia);
router.post('/config/delete-video', checkAuth, deleteVideo);

module.exports = router;
