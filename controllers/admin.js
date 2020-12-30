const { isAuth } = require('../utils/auth');

module.exports.getConfig = (req, res) => {
  const checkAuth = isAuth(req, res);
  if (checkAuth) return checkAuth();
  return res.render('pages/config');
};
