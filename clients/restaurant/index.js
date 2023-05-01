'use strict';

// Connects to the CAPS Application Server using socket.io-client:
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

let restaurantSocket = io(SERVER_URL + '/hungry');
const { orderFromPurchaser } = require('./handler');
// Listen for the delivered event coming in from the CAPS server.
restaurantSocket.on('order', orderFromPurchaser(restaurantSocket));








