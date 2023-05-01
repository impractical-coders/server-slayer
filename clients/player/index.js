'use strict';
const { io } = require('socket.io-client');
require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3002';
let gameSocket = io(SERVER_URL + '/game');
// const Chance = require('chance');
// const chance = new Chance();
const prompt = require('prompt-sync')({ sigint: true });

// import functions from handler
// const { SubmitOrder } = require('./handler');

//player data
let name = prompt('Please enter your name: ', 'Gamer');
let rooms = ['bathroom', 'basement', 'attic'];
let role = null;
let choice = 0;



//join game & ask player to put in name (will be replaced by username from database to make sure the name is UNIQUE)

if (name) {
  gameSocket.emit('joinLobby', name);
}
// getting lobby status
gameSocket.on('lobbyStatus', (currentPlayers) => {
  console.log(`${currentPlayers[currentPlayers.length - 1].name} has joined the lobby.`);
  console.log(`Players in the lobby: ${currentPlayers.length}`);
});
// start the game
gameSocket.on('gameStart', (msg) => {
  console.log(msg);
  gameSocket.emit('myRole', name);
});


// TODO: (it is not working) listen to the room status
gameSocket.on('roomStatus', (roomStatus) => {
  console.log(roomStatus);
});

gameSocket.on('myRole', (myRole) => {
  role = myRole;
  console.log(`You are a ${role}`);
  // sending player to a random room
  let rngRoomIdx = Math.floor(Math.random() * rooms.length);
  gameSocket.emit('roomChange', rooms[rngRoomIdx], name);

//TODO: get the status of the room (who is in there, abd are you in there)
  //players choice
  if (role === 'slayer') {
    choice = prompt('[1] Move [2] Kill | Enter a number: ');

    if (choice === '1') {
      let toRoom = prompt('[1] Bathroom [2] Basement [3] Attic | Enter a number: ');
      // TODO: FIX it will keep prompting until you hit enter
      while (toRoom !== '1' && toRoom !== '2' && toRoom !== '3') {
        toRoom = prompt('Which room do you want to go to? (Please type in the number)? [1] Bathroom [2] Basement [3] Attic');
      }
      console.log('slayer option1 move ', toRoom);
      //move to another room
      gameSocket.emit('roomChange', rooms[toRoom - 1], name);
    } else if (choice === '2') {
      console.log('slayer option2 kill ', choice);
      //Kill a player
    } else if (choice === '3') {
      console.log('slayer option3 chatroom ', choice);
      //open the global chatroom
    }
    while (!['1', '2', '3'].includes(choice)) {
      // PROMPT can NOT be too long, will cause loop
      // while (choice !== '1' && choice !== '2' && choice !== '3') {
      console.log('wrong input', choice);
      choice = prompt('What do you want to do (Please type in the number)? [1] Move to another room [2] Kill a player [3] Global Chat Room');
    }
  } else if (role === 'human') {
    choice = prompt('[1] Move [2] Action | Enter a number: ');
    // need to apply what is from above
    if (choice === '1') {
      console.log('human option1 move', choice);
      //move to another room
    } else if (choice === '2') {
      console.log('human option2 action', choice);
      //Action
    } else if (choice === '3') {
      console.log('human option3 chatroom', choice);
      //open the global chatroom
    }
  }
  // else {
  //   //if player is dead?
  //   choice = prompt('What do you want to do (Please type in the number)? [1] Global Chat Room')
  // }
});






// slayer kill 
// let personToBeKilled = prompt('Who do you want to kill: ');

// gameSocket.emit('playerKill', personToBeKilled);

// SubmitOrder(payload, gameSocket);


