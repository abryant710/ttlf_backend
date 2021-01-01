const path = require('path');

module.exports.getOrigin = (req) => {
  const host = req.get('host');
  const httpPart = host.includes('localhost') ? 'http' : 'https';
  return `${httpPart}://${host}`;
};

module.exports.sendResponse = (
  req,
  res,
  status,
  page,
  successOrError = null,
  formAttributes = {},
) => {
  const sendMessage = successOrError ? {
    [successOrError]: req.flash(successOrError),
  } : {};
  return res
    .status(status)
    .render(page, {
      sendMessage,
      formAttributes,
    });
};

module.exports.rootPath = path.dirname(require.main.filename);
