const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getManageMedia,
  getCreateMedia,
  postCreateMedia,
  getUpdateMedia,
  postUpdateMedia,
  getManageBios,
  deleteMedia,
  postRandomiseMedia,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-media', checkAuth, getManageMedia);
router.get('/config/create-media', checkAuth, getCreateMedia);
router.post('/config/create-media', checkAuth, postCreateMedia);
router.get('/config/update-media', checkAuth, getUpdateMedia);
router.post('/config/update-media', checkAuth, postUpdateMedia);
router.get('/config/manage-bios', checkAuth, getManageBios);
router.post('/config/delete-media', checkAuth, deleteMedia);
router.post('/config/randomise-media', checkAuth, postRandomiseMedia);

module.exports = router;
