
'use strict';

const { players } = require('../models');

module.exports = async (req, res, next) => {
  try{
    if(!req.headers.authorization) { authError(); }

    const token = req.headers.authorization.split(' ').pop();
    const validPlayer = await players.authenticateToken(token);
    req.user = validPlayer;
    req.token = validPlayer.token;
    next();
  } catch (e) {
    authError();
  }

  function authError() {
    next('Invalid Login Credentials');
  }
};

