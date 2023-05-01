'use strict';

function SubmitOrder(payload, socket) {
  socket.emit('order', payload);
}


module.exports = {
  SubmitOrder
};