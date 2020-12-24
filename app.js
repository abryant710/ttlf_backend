// Native node packages
const path = require('path');

// 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
// const rootDir = require('./utils/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const { get404 } = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes);
app.use('/api', apiRoutes);

app.use(get404);

app.listen(process.env.PORT || 5000);
