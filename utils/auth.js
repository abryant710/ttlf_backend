const checkAuth = (req, res) => {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return () => res
      .status(403)
      .redirect('/login');
  }
  return false;
};

const checkSuperAdmin = (req, res) => {
  const { user: { isSuperAdmin }, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return () => res
      .status(403)
      .redirect('/login');
  }
  if (!isSuperAdmin) {
    return () => res
      .status(403)
      .redirect('/404');
  }
  return false;
};

module.exports = { checkAuth, checkSuperAdmin };
