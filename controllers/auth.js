module.exports.getLogin = (_req, res) => {
  res.render('pages/login', {
    formMessage: null,
    formAttributes: {},
  });
};

module.exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  console.info(email, password, 'You are trying to login');
  req.isAuthenticated = true;
  // req.isSuperAdmin = true;
  res.redirect('/config');
};

module.exports.getSendReset = (_req, res) => {
  res.render('pages/send-reset', {
    formMessage: null,
    formAttributes: {},
  });
};

module.exports.postSendReset = (req) => {
  const { email } = req.body;
  console.info(email, 'You are trying to send an email to reset password');
};

module.exports.getResetPassword = (_req, res) => {
  res.render('pages/reset-password', {
    formMessage: null,
    formAttributes: {},
  });
};

module.exports.postResetPassword = (req) => {
  const { password1, password2 } = req.body;
  console.info(password1, password2, 'You are trying to reset your password');
};
