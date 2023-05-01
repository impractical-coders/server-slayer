'use strict';

const socket = require('../socket');
// const emitter = require('../eventPool');
const { PkgReadyToDriver, DriverPickUpPkg, DriverDeliverPkg, DeliverPkgToVendor } = require('./handler');

// jest.mock('../eventPool', () => {
//   return {
//     on: jest.fn(),
//     emit: jest.fn(),
//   };
// });

jest.mock('../socket', () => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
  };
});

console.log = jest.fn();

let payload = {
  store: 'ss',
  orderId: "order2893247",
  customer: "customer575",
  address: "USA"
};

xtest('2 notified when there is a package to be delivered.', async () => {

  PkgReadyToDriver(payload);
  expect(emitter.emit).toHaveBeenCalledWith('PkgReadyToDriver', payload);
});

xtest('3 in transit.', async () => {

  DriverPickUpPkg(payload);
  expect(emitter.emit).toHaveBeenCalledWith('DriverPickUpPkg', payload);
});

xtest('4 driver alert package has been delivered.', async () => {

  DriverDeliverPkg(payload);
  expect(emitter.emit).toHaveBeenCalledWith('DriverDeliverPkg', payload);
});

xtest('5 vendor receive alert package has been delivered', async () => {

  DeliverPkgToVendor(payload);
  expect(emitter.emit).toHaveBeenCalledWith('DeliverPkgToVendor', payload);
});

test('socket notified when there is a package to be delivered.', async () => {

  PkgReadyToDriver(payload, socket);
  expect(socket.emit).toHaveBeenCalledWith('PkgReadyToDriver', payload);
});

test('socket in transit.', async () => {

  DriverPickUpPkg(payload, socket);
  expect(socket.emit).toHaveBeenCalledWith('DriverPickUpPkg', payload);
});

test('socket driver alert package has been delivered.', async () => {

  DriverDeliverPkg(payload, socket);
  expect(socket.emit).toHaveBeenCalledWith('DriverDeliverPkg', payload);
});

test('socket vendor receive alert package has been delivered', async () => {

  DeliverPkgToVendor(payload,socket);
  expect(socket.emit).toHaveBeenCalledWith('DeliverPkgToVendor', payload);
});