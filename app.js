// Native node packages

// 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(adminRoutes);
app.use('/api', apiRoutes);

app.use('/', (_req, res) => {
  res.status(404).send('<h1>This page doesn\'t exist</h1>');
});

app.listen(5000);
