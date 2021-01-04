const { pages: { NOT_FOUND_PAGE, SERVER_ERROR_PAGE } } = require('../utils/pages');

module.exports.get404 = (_req, res) => res
  .status(404)
  .render(NOT_FOUND_PAGE);

module.exports.get500 = (_req, res) => res
  .status(500)
  .render(SERVER_ERROR_PAGE);
