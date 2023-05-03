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
  console.log(`You are a ${role.toUpperCase()}`);
  // sending player to a random room
  let rngRoomIdx = Math.floor(Math.random() * rooms.length);
  gameSocket.emit('roomChange', rooms[rngRoomIdx], name);
  myCurrentRoom = `${rooms[rngRoomIdx]}`;
  console.log(`Current location: ${myCurrentRoom}.`);
});


gameSocket.on('vote', (msg, aliveArr)=>{
  if (aliveArr.includes(name)){
    console.log(msg);
    vote(aliveArr);
  } else {
    console.log('You have been killed!');
    //TODO: need to disconnect or stop all emit, on... because user can still movea arounf
  }
    
});


gameSocket.on('roomStatus', (currentRoomPlayers, thisRoom) => {
  myCurrentRoom = thisRoom;
  playersInCurrentRoom = currentRoomPlayers;
  console.log(`Players inside this room: ${currentRoomPlayers.toString()}`);
  // if (currentRoomPlayers.includes(name)){
  //   actionMainList(role);
  // }
  
});

// make playerAction a separate event, instead of attached to roomstatus
gameSocket.on('playerAction', (i) => actionMainList(role));

gameSocket.on('leftRoom', (name, updatedInsideRoom) => {

  console.log(`${name} has left this room.`);

  let idx = playersInCurrentRoom.indexOf(updatedInsideRoom);
  playersInCurrentRoom.splice(idx, 1);
  console.log(`Still in this room: ${playersInCurrentRoom}`);
});


//functions
function actionMainList (role){
  if (role === 'slayer') {
    //TODO: if slayer join a room first, then more ppl join, slayer wont have the option to kill 
    if (playersInCurrentRoom.length === 1){
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
              '1) Move to another room',
              new inquirer.Separator()
            ],
          },
        ])
        .then((answers) => {
          choice = answers.action.charAt(0);
          actionRoomList(myCurrentRoom, playersInCurrentRoom);
        });
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
              '1) Move to another room',
              '2) Kill a player',
              new inquirer.Separator()
            ],
          },
        ])
        .then((answers) => {
          choice = answers.action.charAt(0);
          actionRoomList(myCurrentRoom, playersInCurrentRoom);
        });
    }
  } else if (role === 'survivor') {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            '1) Move to another room',
            '2) Look around',
            new inquirer.Separator()
          ],
        },
      ])
      .then((answers) => {
        if (answers.action.charAt(0) === '2'){
          choice = '3';
        } else {
          choice = answers.action.charAt(0);
        }
        actionRoomList(myCurrentRoom, playersInCurrentRoom);
      });
  }
}


function actionRoomList (myCurrentRoom, playersInCurrentRoom){
  //Move to another room
  if (choice === '1'){
    myPrevRoom = myCurrentRoom;
    let newRooms = rooms.filter(i => i !== myCurrentRoom);
    // let idx = newRooms.indexOf(myCurrentRoom);
    // console.log('idx',  idx);
    // newRooms.splice(idx, 1);
    // console.log('137 filterd room ', newRooms);
    newRooms.push(new inquirer.Separator());
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Which room do you want to go to?',
          choices: newRooms,
          // [
          //   `${newRooms[0]}`,
          //   `${newRooms[1]}`,
          //   new inquirer.Separator()
          // ],
        },
      ])
      .then((answers) => {
        choice = answers.action;
        myCurrentRoom = choice;
        gameSocket.emit('roomChange', choice, name, myPrevRoom);
        // console.log('155 my current room', myCurrentRoom);
      });
  } else if (choice === '2'){
    //Kill a player
    let userArr = playersInCurrentRoom.filter(i => i !== name);
    userArr.push(new inquirer.Separator());
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
  } else if (choice === '3'){
    //look around
    console.log('There is nothing here.');
    //TODO: needs to go back to the action list / rng events, like u found a key, u fond an exit, but it is locked
  }

}

function vote (alivePlayers){
  let players = alivePlayers.filter(i => i !== name);
  players.push('[ABSTENTION]');
  players.push(new inquirer.Separator());
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Who is the killer? [Voting will end in 10s]',
        choices: players,
      },
    ])
    .then((answers) => {
      console.log(answers.action);
    });
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