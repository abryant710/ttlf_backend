const {
  TTLF_ENV,
} = process.env;

const PROD_ALLOWED_ORIGINS = [
  'https://www.ttlf.net',
  'https://ttlf.net',
  'https://admin.ttlf.net',
];
const DEV_ALLOWED_ORIGIN = '*';

// add headers to allow REST api to recieve requests
module.exports.apiOrigin = (req, res, next) => {
  const { origin } = req.headers;
  if (TTLF_ENV === 'production') {
    if (PROD_ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      return res.status(403).json({
        status: 'failed',
      });
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', DEV_ALLOWED_ORIGIN);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return next();
};

// add headers to allow REST api to recieve requests
module.exports.adminOrigin = (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', DEV_ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return next();
};
