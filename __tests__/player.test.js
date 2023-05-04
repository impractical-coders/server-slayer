'use strict';

// Define the roomStatus function
function roomStatus(socket, playerData) {
  // Get the current room from the playerData object
  const thisRoom = playerData.myCurrentRoom;

  // Get the list of players in the current room from the server
  const currentRoomPlayers = [
    { name: 'TestPlayer2', role: 'crewmate' },
    { name: 'TestPlayer3', role: 'imposter' },
  ];

  // Log the player data to the console
  const playerNames = currentRoomPlayers.map(player => player.name).join(', ');
  console.log(`Players in the ${thisRoom}: ${playerNames}`);

  // Send the player data back to the client
  socket.emit('roomStatus', currentRoomPlayers, thisRoom);
}

// Export the roomStatus function
module.exports = { roomStatus };
