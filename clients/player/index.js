'use strict';
const { io } = require('socket.io-client');
const inquirer = require('inquirer');
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
let myCurrentRoom = null;
let myPrevRoom = null;
let role = null;
let playersInCurrentRoom = null;
let choice = 0;



//join game & enter chatroom ask player to put in name (will be replaced by username from database to make sure the name is UNIQUE)

if (name) {
  gameSocket.emit('joinLobby', name);
  // gameSocket.emit('roomChange', 'chatroom' , name);
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

// find out what my role is & get into a random room
gameSocket.on('myRole', (yourRole) => {
  role = yourRole;
  console.log(`You are a ${role}`);
  // sending player to a random room
  let rngRoomIdx = Math.floor(Math.random() * rooms.length);
  gameSocket.emit('roomChange', rooms[rngRoomIdx], name);
  myCurrentRoom = `${rooms[rngRoomIdx]}`;
  console.log(`Current location: ${myCurrentRoom}.`);

  console.log('hi');
});

gameSocket.on('roomStatus', (currentRoom) => {
  playersInCurrentRoom = currentRoom;
  console.log(playersInCurrentRoom);
  console.log(`Players inside this room: ${currentRoom.toString()}`);
  //TODO: prompt will render multiple times when more players join the room MAY HAVE TO CREATE A NEW EVENT
  playerAction(role);
});

gameSocket.on('leftRoom', (name, updatedInsideRoom) => {
  console.log(`need to update playersInCurrentRoom ${updatedInsideRoom}`);
  console.log(`${name} has left this room.`);
});

// slayer kill 
// let personToBeKilled = prompt('Who do you want to kill: ');

// gameSocket.emit('playerKill', personToBeKilled);

// SubmitOrder(payload, gameSocket);


//function
function playerAction (role){
  if (role === 'slayer') {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            '1) Move to another room',
            '2) Kill a player',
            // new inquirer.Separator(),
          ],
        },
      ])
      .then((answers) => {
        choice = answers.action.charAt(0);
        console.log(`role: slayer ${choice}`);
      });
    console.log('did i get here?');
    if (choice === '1'){
      console.log('ert');
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Which room do you want to go to?',
            choices: [
              '1) bathroom',
              '2) basement',
              '3) attic',
              // new inquirer.Separator(),
            ],
          },
        ])
        .then((answers) => {
          choice = answers.action.charAt(0);
          console.log(`role: slayer ${choice}`);
        });
    }

  } else if (role === 'human') {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            '1) Move to another room',
            '2) Look around',
          ],
        },
      ])
      .then((answers) => {
        choice = answers.action;
        console.log(`role: human ${choice}`);
      });
  }
  // else {
  //   //if player is dead?
  //   choice = prompt('What do you want to do (Please type in the number)? [1] Global Chat Room')
  // }
}


//test input
// const questions = [
//   {
//     type: 'input',
//     name: 'first_name',
//     message: "What's your first name",
//   },
//   {
//     type: 'input',
//     name: 'last_name',
//     message: "What's your last name",
//     default() {
//       return 'Doe';
//     },
//   },
  
  
// ];

// inquirer.prompt(questions).then((answers) => {
//   console.log(JSON.stringify(answers, null, '  '));
// });