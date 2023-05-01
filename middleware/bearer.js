'use strict';

const { readers } = require('../models');

module.exports = async (req, res, next) => {
  try{
    if(!req.headers.authorization) { _authError(); }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await readers.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    _authError();
  }

  function authError() {
    next('Invalid Login Credentials');
  }
};
