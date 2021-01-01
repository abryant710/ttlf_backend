const { pages: { CONFIG_HOME_PAGE } } = require('../utils/pages');
// const { sendResponse } = require('../utils/general');

module.exports.getConfig = (_req, res) => res
  .status(200)
  .render(CONFIG_HOME_PAGE, {
    configPage: 'live',
  });
