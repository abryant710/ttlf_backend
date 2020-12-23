/* eslint-disable no-console */
// Native node packages

// 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(adminRoutes);
app.use('/api', apiRoutes);

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const results = { results: (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send(`Error ${err}`);
  }
});

app.use('/', (_req, res) => {
  res.status(404).send('<h1>This page doesn\'t exist</h1>');
});

app.listen(5000);
