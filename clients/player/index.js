'use strict';
const { io } = require('socket.io-client');
// const inquirer = require('inquirer');
require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3002';
let gameSocket = io(SERVER_URL + '/game');
// const Chance = require('chance');
// const chance = new Chance();
const prompt = require('prompt-sync')({ sigint: true });

// import functions from handler
const { vote, actionMainList, leftRoomStatus, roomStatus, myRole } = require('./handler');

// //player data
let playerData = {
  name : prompt('Please enter your name: ', 'Gamer'),
  rooms : ['bathroom', 'basement', 'attic'],
  myCurrentRoom : null,
  myPrevRoom : null,
  role : null,
  playersInCurrentRoom : null,
  choice : 0,
  tasks: [
    'Found a whiteboard.',
    'Found the exit!',
    'Found a computer, but there is no power.',
    'The windows are barred.',
    'Why is Mona Lisa here?',
    'There is a bed here.',
    'Radio says there is a zombie outbreak.',
    'Cookie Monster!',
    'This is a very nice fountain.',
    'Found Cody\'s resume, must hire him when I get out...',
    'I can see the Statue of Liberty from here.',
    'The TV is playing SpongeBob.',
    'Found the game StarCraft 3.',
    'This house is very old.',
    'Found Ryan\'s resume, must hire him when I get out...',
    'Who is this Rapib guy?',
    'A tiger just walked pass me, need to keep quiet.',
    'It is 1am in the morning',
    'Found Thomas\' resume, must hire him when I get out...',
    'What am I even looking for?',
    'Must take a nap, kind of tired walking around.',
    'Found Kameron\'s resume, must hire him when I get out...',
  ],
};



//join game & enter chatroom ask player to put in name (will be replaced by username from database to make sure the name is UNIQUE)

if (playerData.name) {
  gameSocket.emit('joinLobby', playerData.name);
  // gameSocket.emit('roomChange', 'chatroom' , name);
}
//Global Eventts
gameSocket.on('globalEvent', (msg)=>{
  console.log(msg);
});

// vote result action
gameSocket.on('voteResult', (maxVotePlayer)=>{
  if (maxVotePlayer[0] === playerData.name){
    console.log('[Game Over] You have been kicked out!');
    gameSocket.disconnect(playerData.name);
  }

});

// getting lobby status
gameSocket.on('lobbyStatus', (currentPlayers) => {
  console.log(`${currentPlayers[currentPlayers.length - 1].name} has joined the lobby.`);
  console.log(`Players in the lobby: ${currentPlayers.length}`);
});
// start the game .once happen 1 time
gameSocket.once('gameStart', (msg) => {
  console.log(msg);
  gameSocket.emit('myRole', playerData.name);
});

// find out what my role is & get into a random room
gameSocket.on('myRole', (yourRole) => {
  myRole(yourRole,gameSocket, playerData);
});



gameSocket.on('vote', (msg, aliveArr)=>{
  if (aliveArr.includes(playerData.name)){
    console.log(msg);
    vote(aliveArr, playerData,gameSocket);
  } else {
    console.log('[Game Over] You have been killed!');
    //TODO: show result? update score? clear prompt
    gameSocket.disconnect(playerData.name);
  }
});



gameSocket.on('roomStatus', (currentRoomPlayers, thisRoom) => {
  roomStatus(currentRoomPlayers, thisRoom, playerData);
});

// make playerAction a separate event, instead of attached to roomstatus
gameSocket.on('playerAction', (i) => actionMainList(playerData,gameSocket));

gameSocket.on('leftRoom', (name, updatedInsideRoom) => {
  leftRoomStatus(name, updatedInsideRoom,playerData);

});

module.export = gameSocket;

//functions
// function actionMainList (role){
//   if (role === 'slayer') {
//     //TODO: if slayer join a room first, then more ppl join, slayer wont have the option to kill 
//     if (playersInCurrentRoom.length === 1){
//       inquirer
//         .prompt([
//           {
//             type: 'list',
//             name: 'action',
//             message: 'What do you want to do?',
//             choices: [
//               'Move to another room',
//               new inquirer.Separator()
//             ],
//           },
//         ])
//         .then((answers) => {
//           choice = answers.action.charAt(0);
//           actionRoomList(myCurrentRoom, playersInCurrentRoom);
//         });
//     } else {
//       inquirer
//         .prompt([
//           {
//             type: 'list',
//             name: 'action',
//             message: 'What do you want to do?',
//             choices: [
//               'Move to another room',
//               'Kill a player',
//               new inquirer.Separator()
//             ],
//           },
//         ])
//         .then((answers) => {
//           choice = answers.action.charAt(0);
//           actionRoomList(myCurrentRoom, playersInCurrentRoom);
//         });
//     }
//   } else if (role === 'survivor') {
//     inquirer
//       .prompt([
//         {
//           type: 'list',
//           name: 'action',
//           message: 'What do you want to do?',
//           choices: [
//             'Move to another room',
//             'Look around',
//             new inquirer.Separator()
//           ],
//         },
//       ])
//       .then((answers) => {
//         choice = answers.action.charAt(0);
//         actionRoomList(myCurrentRoom, playersInCurrentRoom);
//       });
//   }
// }


// function actionRoomList (myCurrentRoom, playersInCurrentRoom){
//   //Move to another room
//   if (choice === 'M'){
//     myPrevRoom = myCurrentRoom;
//     let newRooms = rooms.filter(i => i !== myCurrentRoom);
//     // let idx = newRooms.indexOf(myCurrentRoom);
//     // console.log('idx',  idx);
//     // newRooms.splice(idx, 1);
//     // console.log('137 filterd room ', newRooms);
//     newRooms.push(new inquirer.Separator());
//     inquirer
//       .prompt([
//         {
//           type: 'list',
//           name: 'action',
//           message: 'Which room do you want to go to?',
//           choices: newRooms,
//           // [
//           //   `${newRooms[0]}`,
//           //   `${newRooms[1]}`,
//           //   new inquirer.Separator()
//           // ],
//         },
//       ])
//       .then((answers) => {
//         choice = answers.action;
//         myCurrentRoom = choice;
//         gameSocket.emit('roomChange', choice, name, myPrevRoom);
//         // console.log('155 my current room', myCurrentRoom);
//       });
//   } else if (choice === 'K'){
//     //Kill a player
//     let userArr = playersInCurrentRoom.filter(i => i !== name);
//     userArr.push(new inquirer.Separator());
//     inquirer
//       .prompt([
//         {
//           type: 'list',
//           name: 'action',
//           message: 'Which would you like to kill?',
//           choices: userArr,
          
//         },
//       ])
//       .then((answers) => {
//         gameSocket.emit('playerKill', answers.action);
//       });
//   } else if (choice === 'L'){
//     //look around
//     console.log('There is nothing here.');
//     //TODO: needs to go back to the action list / rng events, like u found a key, u fond an exit, but it is locked
//   }

// }

// function vote (alivePlayers){
//   let players = alivePlayers.filter(i => i !== name);
//   players.push('[ABSTENTION]');
//   players.push(new inquirer.Separator());
//   inquirer
//     .prompt([
//       {
//         type: 'list',
//         name: 'action',
//         message: 'Who is the killer?',
//         choices: players,
//       },
//     ])
//     .then((answers) => {
//       console.log(answers.action);
//     });
// }



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