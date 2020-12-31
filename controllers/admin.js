const { checkAuth } = require('../utils/auth');

const configHomePage = 'pages/loggedIn/config';

module.exports.getConfig = (req, res) => {
  const notAuthorised = checkAuth(req, res);
  if (notAuthorised) return notAuthorised();
  const { isSuperAdmin, email: userEmail } = req.session.user;
  return res
    .status(200)
    .render(configHomePage, {
      configPage: 'live',
      isSuperAdmin,
      userEmail,
    });
};
