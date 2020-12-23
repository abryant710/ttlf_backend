const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  res.send('<h1>Login page</h1>');
});

router.post('/login', (req, res) => {
  console.log('You are trying to login');
});

router.get('/home', (_req, res) => {
  res.send('<h1>This is the admin page</h1>');
});

module.exports = router;
