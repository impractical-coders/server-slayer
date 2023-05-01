'use strict';

//json web token
const jwt = require('jsonwebtoken');

//json web key set
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

// https://www.npmjs.com/package/jsonwebtoken (search for auth0)
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

//verify that the user is approved
function verifyUser(req, errorFirstOrUserCallbackFunction) {
  try {

    // extract the token from the user's request
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    // from jsonwebtoken docs
    jwt.verify(token, getKey, {}, errorFirstOrUserCallbackFunction);
  } catch (error) {
    errorFirstOrUserCallbackFunction('Oops. Try Again');
  }
}

module.exports = verifyUser;