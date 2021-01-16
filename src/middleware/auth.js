export const checkAuth = (req, res, next) => {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return res
      .status(403)
      .redirect('/login');
  }
  return next();
};

export const checkSuperAdmin = (req, res, next) => {
  const { user: { isSuperAdmin }, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return res
      .status(403)
      .redirect('/login');
  }
  if (!isSuperAdmin) {
    return res
      .status(403)
      .redirect('/404');
  }
  return next();
};
