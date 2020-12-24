const express = require('express');

const router = express.Router();

router.get('/login', (_req, res) => {
  res.render('pages/login', {
    loginError: false,
  });
});

router.post('/login', (req) => {
  const { email, password } = req.body;
  console.info(email, password, 'You are trying to login');
});

router.get('/send-reset', (_req, res) => {
  res.render('pages/send-reset', {
    emailError: false,
  });
});

router.post('/send-reset', (req) => {
  const { email } = req.body;
  console.info(email, 'You are trying to send an email to reset password');
});

router.get('/reset-password', (_req, res) => {
  res.render('pages/reset-password', {
    passwordMatchError: false,
  });
});

router.post('/reset-password', (req, res) => {
  const { password1, password2 } = req.body;
  if (password1 !== password2) {
    res.render('pages/reset-password', {
      passwordMatchError: true,
    });
  }
  console.info(password1, password2, 'You are trying to reset your password');
});

router.get('/config', (_req, res) => {
  res.render('pages/config');
});

module.exports = router;
