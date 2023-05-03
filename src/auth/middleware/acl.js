'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capability)) {
        console.log('Here\'s the capabilities: ',capability);
        next();
      }
      else {
        next('Access Denied');
      }

    }
    catch (e) {
      next('Invalid Login Credentials');
    }
  };
};
