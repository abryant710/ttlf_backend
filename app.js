/* eslint-disable no-underscore-dangle */
// Native node packages
import path, { dirname } from 'path';
import fs, { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';

// 3rd party packages
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import storeImport from 'connect-mongodb-session';
import csrf from 'csurf';
import flash from 'connect-flash';
import multer from 'multer';
// SHOULD USE FOR FORM VALIDATION
// https://www.npmjs.com/package/validatorjs

import { get404, get500 } from './src/controllers/error.js';
import authRoutes from './src/routes/auth.js';
import superAdminRoutes from './src/routes/superAdmin.js';
import adminRoutes from './src/routes/admin.js';
import apiRoutes from './src/routes/api.js';

const MongoDBStore = storeImport(session);

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const DEFAULT_ROUTE = '/config/live';
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

app.set('view engine', 'ejs'); // set template engine to ejs
app.set('views', 'src/views'); // use src/views folders to store view files

const fileStorage = multer.diskStorage({ // config file storage for uploads
  destination: (req, file, cb) => {
    cb(null, 'public/images/flyer');
  },
  filename: (req, file, cb) => {
    const [, originalExt] = file.originalname.match(/\.([^.]+)$/);
    cb(null, `flyer.${originalExt}`);
  },
});

const fileFilter = (req, file, cb) => { // set file mime types
  const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (validMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  }
  cb(null, false);
};

app.use(bodyParser.json()); // json api data
app.use(bodyParser.urlencoded({ extended: false })); // form data
app.use(multer({ storage: fileStorage, fileFilter }).single('image')); // image uploads
app.use(express.static(path.join(__dirname, 'public'))); // make static folder public
app.use(session({ // configure auth cookies
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
app.use((req, res, next) => { // set local variables for use in templates
  const { isSuperAdmin, email: userEmail } = req.session.user || {};
  res.locals.csrfToken = req.csrfToken();
  res.locals.isSuperAdmin = isSuperAdmin;
  res.locals.userEmail = userEmail;
  next();
});

// define the various routes
app.use(authRoutes);
app.use(superAdminRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);
// redirect to default route for /
app.get(/^\/$/, (_req, res) => res
  .status(200)
  .redirect(DEFAULT_ROUTE));
// set routes for 500 error page and 404 not found page
app.get('/500', get500);
app.use(get404);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  return res.redirect('/500');
});

// create folder for flyer files if it doesn't already exist
const eventDir = path.join(__dirname, 'public/images/flyer');
const checkEventDir = async () => {
  try {
    const dirExist = fs.existsSync(eventDir);
    if (!dirExist) {
      await fsPromises.mkdir(eventDir);
    }
  } catch (err) {
    console.error(err, 'Failed create public/images/flyer dir');
  }
};

checkEventDir();

// spin up the application by connecting to the database and listening on port 5000
const startApp = async () => {
  try {
    await mongoose.connect(
      `${MONGO_DB_URI}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
    );
    console.info(`Successfully connected to the ${TTLF_MONGO_DB} database`);
    console.info(`Running the ${TTLF_ENV} environment`);
    app.listen(process.env.PORT || 5000);
  } catch (err) {
    console.error(err);
  }
};

startApp();
