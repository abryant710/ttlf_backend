const { pages: { NOT_FOUND_PAGE } } = require('../utils/pages');

module.exports.get404 = (_req, res) => res
  .status(404)
  .render(NOT_FOUND_PAGE);
