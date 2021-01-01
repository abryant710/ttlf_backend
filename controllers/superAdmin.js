const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  pages: {
    CREATE_ADMIN_PAGE,
    MANAGE_ADMINS_PAGE,
  },
} = require('../utils/pages');
const { sendMail } = require('../utils/mailer');
const { getOrigin } = require('../utils/general');

const PROTECTED_ADMINS = ['alexbryant710@gmail.com'];

module.exports.getManageAdmins = async (req, res) => {
  try {
    let adminUsers = await User.find({});
    adminUsers = adminUsers.map(({ email, firstName, lastName }) => ({
      email, firstName, lastName,
    })).filter(({ email }) => !PROTECTED_ADMINS.includes(email));
    return res
      .status(200)
      .render(MANAGE_ADMINS_PAGE, {
        sendMessage: null,
        adminUsers,
        configPage: 'admin-users',
      });
  } catch (err) {
    console.error(err);
  }
  req.flash('error', 'Could not fetch the admin users');
  return res
    .status(400)
    .render(MANAGE_ADMINS_PAGE, {
      sendMessage: {
        error: req.flash('error'),
      },
      adminUsers: [],
      configPage: 'admin-users',
    });
};

module.exports.getCreateAdmin = (_req, res) => res
  .status(200)
  .render(CREATE_ADMIN_PAGE, {
    sendMessage: null,
    configPage: 'admin-users',
    formAttributes: {},
  });

module.exports.postCreateAdmin = async (req, res) => {
  const {
    firstName, lastName, email, password1, password2,
  } = req.body;
  const errorResponse = () => res
    .status(400)
    .render(CREATE_ADMIN_PAGE, {
      sendMessage: { error: req.flash('error') },
      configPage: 'admin-users',
      formAttributes: {
        firstName, lastName, email,
      },
    });
  if (!firstName || !lastName || !email || !password1 || !password2) {
    req.flash('error', 'Please complete the form');
    return errorResponse();
  }
  if (password1 !== password2) {
    req.flash('error', 'The passwords do not match');
    return errorResponse();
  }
  if (password1.length < 12) {
    req.flash('error', 'The password must be at least 12 characters long');
    return errorResponse();
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      req.flash('error', `${email} already exists in the database`);
    } else {
      const hashedPassword = await bcrypt.hash(password1, 12);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: false,
      });
      await newUser.save();
      sendMail({
        email,
        subject: 'You have been added as a TTLF admin',
        template: 'newAdmin',
        attrs: {
          origin: getOrigin(req),
        },
      });
      return res
        .status(201)
        .render(CREATE_ADMIN_PAGE, {
          sendMessage: { success: `New admin user ${email} created.` },
          configPage: 'admin-users',
          formAttributes: {},
        });
    }
  } catch (err) {
    console.error(err);
    req.flash('error', `Could not create the user ${email}`);
  }
  return errorResponse();
};
