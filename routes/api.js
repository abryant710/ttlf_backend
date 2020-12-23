const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('<h1>This is the api placeholder</h1>');
});

module.exports = router;
