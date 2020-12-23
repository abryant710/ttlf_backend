const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  console.log('You are trying to login');
});

router.get('/configuration', (_req, res) => {
  res.render('pages/configuration');
});

module.exports = router;
