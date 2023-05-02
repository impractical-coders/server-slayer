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
// start the game .once happen 1 time
gameSocket.once('gameStart', (msg) => {
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
});

// global events listener
gameSocket.on('globalEvents', (msg)=>{
  console.log(msg);
});

// room status
gameSocket.on('roomStatus', (currentRoomPlayers, thisRoom) => {
  myCurrentRoom = thisRoom;
  // console.log('56', myCurrentRoom);
  playersInCurrentRoom = currentRoomPlayers;
  console.log(`Players inside this room: ${currentRoomPlayers.toString()}`);
  //TODO: prompt will render multiple times when more players join the room MAY HAVE TO CREATE A NEW EVENT
  actionMainList(role);
});

gameSocket.on('leftRoom', (name, updatedInsideRoom) => {

  console.log(`${name} has left this room.`);

  let idx = playersInCurrentRoom.indexOf(updatedInsideRoom);
  playersInCurrentRoom.splice(idx, 1);
  console.log(`Still in this room: ${playersInCurrentRoom}`);
});

// slayer kill 
// let personToBeKilled = prompt('Who do you want to kill: ');

// gameSocket.emit('playerKill', personToBeKilled);

// SubmitOrder(payload, gameSocket);


//function
function actionMainList (role){
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
        // console.log('97', myCurrentRoom);
        actionRoomList(myCurrentRoom, playersInCurrentRoom);
      });

    

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

// move to another room
function actionRoomList (myCurrentRoom, playersInCurrentRoom){
  //Move to another room
  if (choice === '1'){
    myPrevRoom = myCurrentRoom;
    let newRooms = rooms.filter(i => i !== myCurrentRoom);
    // let idx = newRooms.indexOf(myCurrentRoom);
    // console.log('idx',  idx);
    // newRooms.splice(idx, 1);
    // console.log('137 filterd room ', newRooms);
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Which room do you want to go to?',
          choices: [
            `${newRooms[0]}`,
            `${newRooms[1]}`,
            // new inquirer.Separator(),
          ],
        },
      ])
      .then((answers) => {
        choice = answers.action;
        myCurrentRoom = choice;
        gameSocket.emit('roomChange', choice, name, myPrevRoom);
        // console.log('155 my current room', myCurrentRoom);
      });
  } else if (choice === '2'){
    //Kill a player playersInCurrentRoom
    let userArr = playersInCurrentRoom.filter(i => i !== name);
    console.log(userArr);
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Which would you like to kill?',
          choices: userArr,
        },
      ])
      .then((answers) => {
        gameSocket.emit('playerKill', answers.action);
      });
  }

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