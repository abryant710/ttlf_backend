const path = require('path');

module.exports.getOrigin = (req) => {
  const host = req.get('host');
  const httpPart = host.includes('localhost') ? 'http' : 'https';
  return `${httpPart}://${host}`;
};

module.exports.rootPath = path.dirname(require.main.filename);
