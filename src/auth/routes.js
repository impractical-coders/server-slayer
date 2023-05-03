'use strict';

const express = require('express');
const authRouter = express.Router();

const { admin } = require('./models');
const basicAuth = require('./middleware/basics');
const bearerAuth = require('./middleware/bearer');
const permissions = require('./middleware/acl');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await admin.create(req.body);
    console.log('testing user record function', userRecord);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
});

authRouter.get('/admin', bearerAuth, permissions('delete'), async (req, res, next) => {
  const userRecords = await admin.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/slayers', bearerAuth, async (req, res, next) => {
  res.status(200).send('WELCOME TO YOUR DEMISE!');
});

module.exports = authRouter;
