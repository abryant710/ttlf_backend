const { isAuth } = require('../utils/auth');

module.exports.getConfig = (_req, res) => {
  isAuth(res)();
  return res.render('pages/config');
};
