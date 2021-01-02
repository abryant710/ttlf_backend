const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getYouTubeVideos,
  deleteVideo,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-videos', checkAuth, getYouTubeVideos);
router.post('/config/delete-video', checkAuth, deleteVideo);

module.exports = router;
