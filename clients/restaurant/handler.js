'use strict';
// Your implementation should use a store name as a parameter.
function orderFromPurchaser(socket) {
  console.log('in order from purchaser')

  return (order)=> {
    console.log('ORDER: ', order)
    order.status = "order received! Food is being made..."
    console.log('order recieved: ', order);
    socket.emit('status', order);
  
    setTimeout(()=> {
  
      order.status = "order is ready for pickup!"
      console.log('order ready for pickup: ', order);
      socket.emit('status', order);
  
    }, 3000)
  }

    

}


function thankyouFromVendor(payload) {
  console.log(`Thank you, ${payload.customer}`);
  // After the delivery event has been received, exit the application using process.exit().
  // process.exit();
};




module.exports = {
  orderFromPurchaser,
  thankyouFromVendor
}