const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getYouTubeVideos,
  getCreateVideo,
  postCreateVideo,
  deleteVideo,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-videos', checkAuth, getYouTubeVideos);
router.get('/config/create-video', checkAuth, getCreateVideo);
router.post('/config/create-video', checkAuth, postCreateVideo);
router.post('/config/delete-video', checkAuth, deleteVideo);

module.exports = router;
