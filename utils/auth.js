const isAuth = (req, res) => {
  if (!req.session.isLoggedIn) {
    return () => res.redirect('/login');
  }
  return false;
};

const isSuperAdmin = (req, res) => {
  if (!req.session.isLoggedIn) {
    return () => res.redirect('/login');
  }
  if (!req.session.isSuperAdmin) {
    return () => res.redirect('/404');
  }
  return false;
};

module.exports = { isAuth, isSuperAdmin };
