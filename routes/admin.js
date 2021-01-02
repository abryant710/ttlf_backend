const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getYouTubeVideos,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/videos', checkAuth, getYouTubeVideos);

module.exports = router;
