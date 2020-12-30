const isAuth = (res) => {
  const { isAuthenticated } = res;
  if (!isAuthenticated) {
    return () => res.redirect('/login');
  }
  return () => null;
};

module.exports = { isAuth };
