const path = require('path');

module.exports.getOrigin = (req) => {
  const host = req.get('host');
  const httpPart = host.includes('localhost') ? 'http' : 'https';
  return `${httpPart}://${host}`;
};

module.exports.getFlashMessage = (req) => {
  let messageType = null;
  let messageText = '';
  const flashError = req.flash('error');
  const flashSuccess = req.flash('success');
  if (flashError.length) {
    messageType = 'error';
    [messageText] = flashError;
  } else if (flashSuccess.length) {
    messageType = 'success';
    [messageText] = flashSuccess;
  }
  return [messageType, messageText];
};

module.exports.sendResponse = (
  req,
  res,
  status,
  page,
  successOrError = null,
  additionalAttrs = [],
) => {
  const sendMessage = successOrError ? {
    [successOrError]: req.flash(successOrError),
  } : {};
  const extraAttrs = {};
  additionalAttrs.forEach(([key, val]) => {
    extraAttrs[key] = val;
  });
  return res
    .status(status)
    .render(page, {
      sendMessage,
      ...extraAttrs,
    });
};

module.exports.rootPath = path.dirname(require.main.filename);
