module.exports.getLogin = (_req, res) => {
  res.render('pages/login', {
    loginError: false,
  });
};

module.exports.postLogin = (req) => {
  const { email, password } = req.body;
  console.info(email, password, 'You are trying to login');
};

module.exports.getSendReset = (_req, res) => {
  res.render('pages/send-reset', {
    emailError: false,
  });
};

module.exports.postSendReset = (req) => {
  const { email } = req.body;
  console.info(email, 'You are trying to send an email to reset password');
};

module.exports.getResetPassword = (_req, res) => {
  res.render('pages/reset-password', {
    passwordMatchError: false,
  });
};

module.exports.postResetPassword = (req, res) => {
  const { password1, password2 } = req.body;
  if (password1 !== password2) {
    res.render('pages/reset-password', {
      passwordMatchError: true,
    });
  }
  console.info(password1, password2, 'You are trying to reset your password');
};

module.exports.getConfig = (_req, res) => {
  res.render('pages/config');
};
