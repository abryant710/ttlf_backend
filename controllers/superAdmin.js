const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { pages: { CREATE_ADMIN_PAGE } } = require('../utils/pages');

module.exports.getCreateAdmin = (req, res) => {
  const { isSuperAdmin, email: userEmail } = req.session.user;
  return res
    .status(200)
    .render(CREATE_ADMIN_PAGE, {
      isSuperAdmin,
      userEmail,
      formMessage: null,
      configPage: 'admin-users',
      formAttributes: {},
    });
};

module.exports.postCreateAdmin = async (req, res) => {
  const { isSuperAdmin, email: userEmail } = req.session.user;
  const {
    firstName, lastName, email, password1, password2,
  } = req.body;
  if (!firstName || !lastName || !email || !password1 || !password2) {
    return res
      .status(400)
      .render(CREATE_ADMIN_PAGE, {
        isSuperAdmin,
        userEmail,
        formMessage: { error: 'Please complete the form' },
        configPage: 'admin-users',
        formAttributes: {
          firstName, lastName, email,
        },
      });
  }
  if (password1 !== password2) {
    return res
      .status(400)
      .render(CREATE_ADMIN_PAGE, {
        isSuperAdmin,
        userEmail,
        formMessage: { error: 'The passwords do not match' },
        configPage: 'admin-users',
        formAttributes: {
          firstName, lastName, email,
        },
      });
  }
  if (password1.length < 12) {
    return res
      .status(400)
      .render(CREATE_ADMIN_PAGE, {
        isSuperAdmin,
        userEmail,
        formMessage: { error: 'The password must be at least 12 characters long' },
        configPage: 'admin-users',
        formAttributes: {
          firstName, lastName, email,
        },
      });
  }
  let existingUserError = '';
  try {
    const user = await User.findOne({ email });
    if (user) {
      existingUserError = `${email} already exists in the database`;
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
      return res
        .status(201)
        .render(CREATE_ADMIN_PAGE, {
          isSuperAdmin,
          userEmail,
          formMessage: { success: `New admin user ${email} created successfully.` },
          configPage: 'admin-users',
          formAttributes: {},
        });
    }
  } catch (err) {
    console.error(err);
    existingUserError = `Could not create the user ${email}`;
  }
  return res
    .status(400)
    .render(CREATE_ADMIN_PAGE, {
      isSuperAdmin,
      userEmail,
      formMessage: { error: existingUserError },
      configPage: 'admin-users',
      formAttributes: {
        firstName, lastName, email,
      },
    });
};
