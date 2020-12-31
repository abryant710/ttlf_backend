const { pages: { CONFIG_HOME_PAGE } } = require('../utils/pages');

module.exports.getConfig = (_req, res) => res
  .status(200)
  .render(CONFIG_HOME_PAGE, {
    configPage: 'live',
  });
