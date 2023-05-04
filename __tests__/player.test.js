'use strict';

// Import the functions we want to test
const { roomStatus } = require('../clients/player/handler');

// Create a mock playerData object with a fake room and name
const playerData = {
  name: 'TestPlayer',
  myCurrentRoom: 'bathroom',
};

// Create a mock socket object with an 'on' method that takes a callback
const mockSocket = {
  on: (event, callback) => {
    // If the event is 'roomStatus', call the callback with some mock data
    if (event === 'roomStatus') {
      const currentRoomPlayers = [
        { name: 'TestPlayer2', role: 'crewmate' },
        { name: 'TestPlayer3', role: 'imposter' },
      ];
      const thisRoom = 'bathroom';
      callback(currentRoomPlayers, thisRoom);
    }
  },
};

describe('roomStatus function', () => {
  it('should log the current players in the room', () => {
    // Mock the console.log method
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });

    // Call the function with the mock data
    roomStatus(mockSocket, playerData);

    // Verify that console.log was called with the expected string
    expect(consoleLog).toHaveBeenCalledWith(
      'Players in the bathroom: TestPlayer2, TestPlayer3'
    );
  });
});
