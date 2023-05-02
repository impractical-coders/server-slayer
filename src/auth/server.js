'use strict';

// 3rd Party Resources
const express = require('express');
//const cors = require('cors');


// Esoteric Resources
const errorNotFound = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const v1Routes = require('../routes/v1.js');
const authRoutes = require('../auth/routes.js');

// Prepare the express app
const app = express();

// App Level MW
//app.use(cors());

app.use(express.json());
app.use(logger);
//app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
// port 3001 = http://localhost:3001/api/v1/books
app.use('/api/v1', v1Routes);

// Catchalls
app.use('*', errorNotFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Port not found'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
