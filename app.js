// Native node packages
const path = require('path');

// 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
// const rootDir = require('./utils/path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const {
  TTLF_MONGO_USER,
  TTLF_MONGO_PW,
  TTLF_MONGO_URI,
  TTLF_MONGO_DB,
  TTLF_SESSION_SECRET,
} = process.env;

const MONGO_DB_URI = `mongodb+srv://${TTLF_MONGO_USER}:${TTLF_MONGO_PW}@${TTLF_MONGO_URI}/${TTLF_MONGO_DB}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const { get404 } = require('./controllers/error');
const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/superAdmin');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({ extended: false }));
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

const defaultRoute = '/config';

app.use(authRoutes);
app.use(superAdminRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

app.get(/^\/$/, (_req, res) => {
  res.status(200).redirect(defaultRoute);
});

app.use(get404);

mongoose.connect(
  `${MONGO_DB_URI}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
)
  .then(() => {
    console.info(`Successfully connected to the ${TTLF_MONGO_DB} database`);
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.error(err);
  });
