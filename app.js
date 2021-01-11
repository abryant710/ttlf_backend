// Native node packages
const path = require('path');

// 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const {
  TTLF_MONGO_USER,
  TTLF_MONGO_PW,
  TTLF_MONGO_URI,
  TTLF_MONGO_DB,
  TTLF_SESSION_SECRET,
  TTLF_ENV,
} = process.env;

const MONGO_DB_URI = `mongodb+srv://${TTLF_MONGO_USER}:${TTLF_MONGO_PW}@${TTLF_MONGO_URI}/${TTLF_MONGO_DB}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const { get404, get500 } = require('./src/controllers/error');
const authRoutes = require('./src/routes/auth');
const superAdminRoutes = require('./src/routes/superAdmin');
const adminRoutes = require('./src/routes/admin');
const apiRoutes = require('./src/routes/api');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/flyer');
  },
  filename: (req, file, cb) => {
    const [, originalExt] = file.originalname.match(/\.([^.]+)$/);
    cb(null, `flyer.${originalExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(bodyParser.json()); // json api data
app.use(bodyParser.urlencoded({ extended: false })); // form data
app.use(multer({ storage: fileStorage, fileFilter }).single('image')); // image uploads
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: TTLF_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 24 * 60 * 60 * 1000,
  },
  store,
}));
app.use(csrfProtection); // protect form submission from csrf
app.use(flash()); // allow messages to be flashed
app.use((_req, res, next) => { // add headers to allow REST api to recieve requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req, res, next) => {
  const { isSuperAdmin, email: userEmail } = req.session.user || {};
  res.locals.csrfToken = req.csrfToken();
  res.locals.isSuperAdmin = isSuperAdmin;
  res.locals.userEmail = userEmail;
  next();
});

const DEFAULT_ROUTE = '/config/live';

app.use(authRoutes);
app.use(superAdminRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

app.get(/^\/$/, (_req, res) => res
  .status(200)
  .redirect(DEFAULT_ROUTE));

app.get('/500', get500);
app.use(get404);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  return res.redirect('/500');
});

mongoose.connect(
  `${MONGO_DB_URI}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
)
  .then(() => {
    console.info(`Successfully connected to the ${TTLF_MONGO_DB} database`);
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.error(err);
  });

console.info(`Running the ${TTLF_ENV} environment`);
