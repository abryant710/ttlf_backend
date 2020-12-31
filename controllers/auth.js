const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { pages: { LOGIN_PAGE } } = require('../utils/pages');

module.exports.getLogin = (_req, res) => res
  .status(200)
  .render(LOGIN_PAGE, {
    formMessage: '',
    formAttributes: {},
  });

module.exports.postLogin = async (req, res) => {
  const { email, password1 } = req.body;
  const loginError = 'Could not sign in successfully';
  try {
    const user = await User.findOne({ email });
    if (user) {
      const { isAdmin, password } = user;
      const passwordsMatch = await bcrypt.compare(password1, password);
      if (passwordsMatch) {
        req.session.user = user;
        req.session.isLoggedIn = isAdmin;
        return res
          .status(200)
          .redirect('/config');
      }
    }
  } catch (err) {
    console.error(err);
  }
  return res
    .status(403)
    .render(LOGIN_PAGE, {
      formMessage: {
        error: loginError,
      },
      formAttributes: {},
    });
};

module.exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    return res
      .status(201)
      .redirect('/login');
  });
};

module.exports.getSendReset = (_req, res) => res
  .status(200)
  .render('pages/loggedOut/send-reset', {
    formMessage: null,
    formAttributes: {},
  });

module.exports.postSendReset = (req) => {
  const { email } = req.body;
  console.info(email, 'You are trying to send an email to reset password');
};

module.exports.getResetPassword = (_req, res) => res
  .status(200)
  .render('pages/loggedOut/reset-password', {
    formMessage: null,
    formAttributes: {},
  });

module.exports.postResetPassword = (req) => {
  const { password1, password2 } = req.body;
  console.info(password1, password2, 'You are trying to reset your password');
};
