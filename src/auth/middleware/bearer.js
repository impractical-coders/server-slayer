'use strict';

const { admin } = require('../models');

module.exports = async (req, res, next) => {
  try{
    if(!req.headers.authorization) { _authError(); }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await admin.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid Login Credentials');
  }
};
