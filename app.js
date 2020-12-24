// Native node packages
const path = require('path');

// 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
// const { Pool } = require('pg');
// const rootDir = require('./utils/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// const pool = new Pool({
//   connectionString: process.env.TTLF_DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes);
app.use('/api', apiRoutes);

// Example of connecting to a database
// app.get('/db', async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM users');
//     const results = { results: (result) ? result.rows : null };
//     res.render('pages/db', results);
//     client.release();
//     res.send('<h1>Successful connection</h1>');
//   } catch (err) {
//     console.error(err);
//     res.send(`Error: ${err}`);
//   }
// });

app.use('/', (_req, res) => {
  res.status(404).render('pages/404');
});

app.listen(process.env.PORT || 5000);
