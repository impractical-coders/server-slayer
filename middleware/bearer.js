'use strict';

const { players } = require('../models');

module.exports = async (req, res, next) => {
  try{
    if(!req.headers.authorization) { authError(); }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await players.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    authError();
  }

  function authError() {
    next('Invalid Login Credentials');
  }
};
