const { isSuperAdmin } = require('../utils/auth');

// TODO: add super admin logic for these routes

module.exports.getCreateAdmin = (req, res) => {
  const checkAuth = isSuperAdmin(req, res);
  if (checkAuth) return checkAuth();
  return res.render('pages/create-admin', {
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
    console.log({
      formMessage: { error: 'Please complete the form' },
      formAttributes: {
        firstName, lastName, email,
      },
    });
    return res.render('pages/create-admin', {
      formMessage: { error: 'Please complete the form' },
      formAttributes: {
        firstName, lastName, email,
      },
    });
  }
  if (password1 !== password2) {
    return res.render('pages/create-admin', {
      formMessage: { error: 'The passwords do not match' },
      formAttributes: {
        firstName, lastName, email,
      },
    });
  }
  if (password1.length < 12) {
    return res.render('pages/create-admin', {
      formMessage: { error: 'The password must be at least 12 characters long' },
      formAttributes: {
        firstName, lastName, email,
      },
    });
  }
  return res.render('pages/create-admin', {
    formMessage: { success: `New admin user ${email} created successfully.` },
    formAttributes: {},
  });
};
