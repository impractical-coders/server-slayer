'use strict';

const socket = require('../socket');
// const emitter = require('../../eventPool');
let { orderFromVendor, thankyouFromVendor } = require('./handler');
jest.mock('../socket', () => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
  };
});

// jest.mock('../eventPool', () => {
//   return {
//     on: jest.fn(),
//     emit: jest.fn(),
//   };
// });

console.log = jest.fn();

// xtest('1 vendor Pkg ready To Be Picked up', async () => {
//   orderFromVendor('aaa');
//   let order = {
//     store: 'aaa',
//     orderId: "order2893247",
//     customer: "customer575",
//     address: "USA"
//   };
//   expect(console.log).toHaveBeenCalledWith('pkg ready');
//   expect(emitter.emit).toHaveBeenCalledWith('PkgReadyFromVendor', order);
// });

// xtest('5 vendor receive package delivered msg', async () => {
//   let obj = {
//     customer: "a"
//   };
//   thankyouFromVendor(obj);

//   expect(console.log).toHaveBeenCalledWith(`5b Thank you, a`);

// });

test('SOCKET vendor Pkg ready To Be Picked up', async () => {
  orderFromVendor('aaa',socket);
  let order = {
    store: 'aaa',
    orderId: "order2893247",
    customer: "customer575",
    address: "USA"
  };
  expect(console.log).toHaveBeenCalledWith('pkg ready');
  expect(socket.emit).toHaveBeenCalledWith('joinRoom', order);
});

test('SOCKET vendor receive package delivered msg', async () => {
  let obj = {
    customer: "a"
  };
  let spy = jest.spyOn(global.console,'log');
  thankyouFromVendor(obj);
  // expect(console.log).toHaveBeenCalled();
  expect(spy).toHaveBeenCalled();
});