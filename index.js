'use strict';

require('dotenv').config();
const app = require('./src/auth/server');
const { db } = require('./src/auth/models');

db.sync().then(() => {
  app.start(process.env.PORTS || 3006);
});
