const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getYouTubeVideos,
  getCreateVideo,
  postCreateVideo,
  getUpdateVideo,
  postUpdateVideo,
  deleteVideo,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-videos', checkAuth, getYouTubeVideos);
router.get('/config/create-video', checkAuth, getCreateVideo);
router.post('/config/create-video', checkAuth, postCreateVideo);
router.get('/config/update-video', checkAuth, getUpdateVideo);
router.post('/config/update-video', checkAuth, postUpdateVideo);
router.post('/config/delete-video', checkAuth, deleteVideo);

module.exports = router;
