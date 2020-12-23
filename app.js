const http = require('http');

const server = http.createServer((req, res) => {
  res.write('<p>Hello23</p>');
  res.end();
});

server.listen(5000);
