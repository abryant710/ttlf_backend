const { isAuth, isSuperAdmin } = require('../utils/auth');

const createAdminPage = 'pages/loggedIn/create-admin';

// TODO: add super admin logic for these routes

module.exports.getCreateAdmin = (req, res) => {
  // TODO: change this to isSuperAdmin
  const checkAuth = isAuth(req, res);
  if (checkAuth) return checkAuth();
  return res
    .status(200)
    .render(createAdminPage, {
      formMessage: null,
      formAttributes: {},
    });
};

module.exports.postCreateAdmin = (req, res) => {
  const checkAuth = isSuperAdmin(req, res);
  if (checkAuth) return checkAuth();
  const {
    firstName, lastName, email, password1, password2,
  } = req.body;
  if (!firstName || !lastName || !email || !password1 || !password2) {
    return res
      .status(400)
      .render(createAdminPage, {
        formMessage: { error: 'Please complete the form' },
        formAttributes: {
          firstName, lastName, email,
        },
      });
  }
  if (password1 !== password2) {
    return res
      .status(400)
      .render(createAdminPage, {
        formMessage: { error: 'The passwords do not match' },
        formAttributes: {
          firstName, lastName, email,
        },
      });
  }
  if (password1.length < 12) {
    return res
      .status(400)
      .render(createAdminPage, {
        formMessage: { error: 'The password must be at least 12 characters long' },
        formAttributes: {
          firstName, lastName, email,
        },
      });
  }
  return res
    .status(201)
    .render(createAdminPage, {
      formMessage: { success: `New admin user ${email} created successfully.` },
      formAttributes: {},
    });
};
