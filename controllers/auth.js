const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const {
  pages: {
    LOGIN_PAGE, SEND_RESET_PAGE, RESET_PW_PAGE,
  },
} = require('../utils/pages');
const { getOrigin } = require('../utils/general');
const { sendMail } = require('../utils/mailer');

const sendResponse = (
  req,
  res,
  status,
  page,
  successOrError = 'error',
  formAttributes = {},
) => res
  .status(status)
  .render(page, {
    formMessage: {
      [successOrError]: req.flash(successOrError),
    },
    formAttributes,
  });

module.exports.getLogin = (req, res) => {
  let formMessage = '';
  const flashError = req.flash('error');
  const flashSuccess = req.flash('success');
  if (flashError.length) {
    formMessage = { error: formMessage };
  } else if (flashSuccess.length) {
    formMessage = { success: flashSuccess };
  }
  return res
    .status(200)
    .render(LOGIN_PAGE, {
      formMessage,
      formAttributes: {},
    });
};

module.exports.postLogin = async (req, res) => {
  const { email, password1 } = req.body;
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
  req.flash('error', 'Could not sign in successfully');
  return sendResponse(req, res, 403, LOGIN_PAGE);
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
  .render(SEND_RESET_PAGE, {
    formMessage: null,
    formAttributes: {},
  });

module.exports.postSendReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const resetPasswordExpires = new Date();
      resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 4);
      const resetPasswordToken = uuidv4();
      await user.updateOne({
        resetPasswordToken,
        resetPasswordExpires,
      });
      sendMail({
        email,
        subject: 'You have requested to reset your TTLF admin password',
        template: 'passwordReset',
        attrs: {
          origin: getOrigin(req),
          token: resetPasswordToken,
          email,
        },
      });
      req.flash('success', 'A password reset email has been sent. Please check your email.');
      return sendResponse(req, res, 200, SEND_RESET_PAGE, 'success');
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Unable to send a reset email for this user');
  return sendResponse(req, res, 403, SEND_RESET_PAGE);
};

module.exports.getResetPassword = async (req, res) => {
  const { email, token } = req.query;
  try {
    if (email && token) {
      const user = await User.findOne({ email });
      if (user) {
        const { resetPasswordToken, resetPasswordExpires } = user;
        if (token === resetPasswordToken && new Date() < resetPasswordExpires) {
          return res
            .status(200)
            .render(RESET_PW_PAGE, {
              formMessage: null,
              formAttributes: { email, token },
            });
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'The reset token is either expired or not valid. Please try resetting it again.');
  return res.redirect('/login');
};

module.exports.postResetPassword = async (req, res) => {
  const {
    email, token, password1, password2,
  } = req.body;
  if (password1 !== password2) {
    req.flash('error', 'The passwords do not match');
    return sendResponse(req, res, 403, RESET_PW_PAGE, 'error', {
      email, token,
    });
  }
  if (password1.length < 12) {
    req.flash('error', 'The password must be at least 12 characters long');
    return sendResponse(req, res, 403, RESET_PW_PAGE, 'error', {
      email, token,
    });
  }
  try {
    const user = await User.findOne({ email });
    const { resetPasswordToken, resetPasswordExpires } = user;
    if (user && token === resetPasswordToken && new Date() < resetPasswordExpires) {
      const hashedPassword = await bcrypt.hash(password1, 12);
      await user.updateOne({
        password: hashedPassword,
        resetPasswordExpires: new Date(),
      });
      req.flash('success', 'Your password has been reset successfully.');
      return res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Failed to reset the password for this user');
  return sendResponse(req, res, 403, RESET_PW_PAGE, 'error', {
    email, token,
  });
};
