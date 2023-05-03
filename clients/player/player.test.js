const { io } = require('socket.io-client');
const assert = require('assert');
require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3002';
let gameSocket;

describe('Game tests', () => {
  before(() => {
    // connect to the game server
    gameSocket = io(SERVER_URL + '/game');
  });

  after(() => {
    // disconnect from the game server
    gameSocket.disconnect();
  });

  it('should emit joinLobby event with player name', (done) => {
    const playerName = 'test player';

    // listen for the 'lobbyStatus' 
    gameSocket.on('lobbyStatus', (currentPlayers) => {
      const lastPlayer = currentPlayers[currentPlayers.length - 1];
      assert.strictEqual(lastPlayer.name, playerName);
      done();
    });

    // emit the 'joinLobby' event with the player name
    gameSocket.emit('joinLobby', playerName);
  });
});