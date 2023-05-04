'use strict';

const http = require('http');
const auth = require('basic-auth');

const USERNAME = 'admin';
const PASSWORD = 'password';

const server = http.createServer((req, res) => {
  const credentials = auth(req);

  if (!credentials || credentials.name !== USERNAME || credentials.pass !== PASSWORD) {
    res.statusCode = 401;
    res.setHeader('Authenticate', 'No-Go "Enter your username and password"');
    res.end('Unauthorized');
  } else {
    // User is authenticated
    res.end('YeeHaw');
  }
});

server.listen(3002, () => {
  console.log('Server running on http://localhost:3002');
});

module.exports = auth;