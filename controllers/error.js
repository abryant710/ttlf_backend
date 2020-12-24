module.exports.get404 = (_req, res) => {
  res.status(404).render('pages/404');
};
