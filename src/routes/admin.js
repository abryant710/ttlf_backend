const express = require('express');
const { checkAuth } = require('../middleware/auth');

const {
  getConfig,
  getManageMedia,
  getCreateMedia,
  postCreateMedia,
  getUpdateMedia,
  postUpdateMedia,
  deleteMedia,
  postRandomiseMedia,
  getManageBios,
  getCreateBio,
  postCreateBio,
  postUpdateBio,
  deleteBio,
} = require('../controllers/admin');

const router = express.Router();
router.get('/config/live', checkAuth, getConfig);
router.get('/config/manage-media', checkAuth, getManageMedia);
router.get('/config/create-media', checkAuth, getCreateMedia);
router.post('/config/create-media', checkAuth, postCreateMedia);
router.get('/config/update-media', checkAuth, getUpdateMedia);
router.post('/config/update-media', checkAuth, postUpdateMedia);
router.post('/config/delete-media', checkAuth, deleteMedia);
router.post('/config/randomise-media', checkAuth, postRandomiseMedia);
router.get('/config/manage-bios', checkAuth, getManageBios);
router.get('/config/create-bio', checkAuth, getCreateBio);
router.post('/config/update-bio', checkAuth, postUpdateBio);
router.post('/config/create-bio', checkAuth, postCreateBio);
router.post('/config/delete-bio', checkAuth, deleteBio);

module.exports = router;
