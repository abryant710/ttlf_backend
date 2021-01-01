const path = require('path');

module.exports.getOrigin = (req) => {
  const host = req.get('host');
  console.log(host);
};

module.exports.rootPath = path.dirname(require.main.filename);
