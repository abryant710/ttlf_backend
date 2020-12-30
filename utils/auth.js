const isAuth = (req, res) => {
  if (!req.session.isLoggedIn) {
    return () => res.status(401).redirect('/login');
  }
  return false;
};

const isSuperAdmin = (req, res) => {
  if (!req.session.isLoggedIn) {
    return () => res.status(401).redirect('/login');
  }
  if (!req.session.isSuperAdmin) {
    return () => res.status(401).redirect('/404');
  }
  return false;
};

module.exports = { isAuth, isSuperAdmin };
