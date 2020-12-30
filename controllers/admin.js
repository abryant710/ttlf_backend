const { isAuth } = require('../utils/auth');

const configHomePage = 'pages/loggedIn/config';

module.exports.getConfig = (req, res) => {
  const checkAuth = isAuth(req, res);
  if (checkAuth) return checkAuth();
  return res
    .status(200)
    .render(configHomePage, {
      configPage: 'live',
    });
};
