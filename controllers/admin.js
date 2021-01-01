const { pages: { CONFIG_HOME_PAGE } } = require('../utils/pages');
const { sendResponse } = require('../utils/general');

module.exports.getConfig = (req, res) => sendResponse(
  req, res, 200, CONFIG_HOME_PAGE, null, [['configPage', 'live']],
);
