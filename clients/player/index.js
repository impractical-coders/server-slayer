'use strict';
const { io } = require('socket.io-client');
// const inquirer = require('inquirer');
require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3003';
let gameSocket = io(SERVER_URL + '/game');
// const Chance = require('chance');
// const chance = new Chance();
const prompt = require('prompt-sync')({ sigint: true });

// import functions from handler
const { vote, actionMainList, leftRoomStatus, roomStatus, myRole } = require('./handler');

const jwt = require('jsonwebtoken');

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRob21hcyIsImlhdCI6MTY4MzIyOTU0Mn0.3-UFdoKRd3DRcRFs6XeSJWNv0F3CFLfyMujp8EUfypU';
let token = prompt('Please enter your token');
const decoded = jwt.decode(token);

console.log(decoded.username);

// //player data
let playerData = {
  name : decoded.username,
  rooms : ['bathroom', 'basement', 'attic'],
  myCurrentRoom : null,
  myPrevRoom : null,
  role : null,
  playersInCurrentRoom : null,
  choice : 0,
  tasks: [
    'Found a whiteboard.',
    // 'Found the exit!',
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



if (playerData.name) {
  gameSocket.emit('joinLobby', playerData.name);
}

gameSocket.on('globalEvent', (msg)=>{
  console.log(msg);
});

gameSocket.on('voteResult', (maxVotePlayer)=>{
  if (maxVotePlayer[0] === playerData.name){
    console.log('[Game Over] You have been kicked out!');
    gameSocket.disconnect(playerData.name);
  }
});

gameSocket.on('lobbyStatus', (currentPlayers) => {
  console.log(`${currentPlayers[currentPlayers.length - 1].name} has joined the lobby.`);
  console.log(`Players in the lobby: ${currentPlayers.length}`);
});

gameSocket.once('gameStart', (msg) => {
  console.log(msg);
  gameSocket.emit('myRole', playerData.name);
});

gameSocket.on('myRole', (yourRole) => {
  myRole(yourRole,gameSocket, playerData);
});

gameSocket.on('vote', (msg, aliveArr)=>{
  if (aliveArr.includes(playerData.name)){
    console.log(msg);
    vote(aliveArr, playerData,gameSocket);
  } else {
    console.log('[Game Over] You have been killed!');
    gameSocket.disconnect(playerData.name);
  }
});



gameSocket.on('roomStatus', (currentRoomPlayers, thisRoom) => {
  roomStatus(currentRoomPlayers, thisRoom, playerData);
});

gameSocket.on('playerAction', (i) => actionMainList(playerData,gameSocket));

gameSocket.on('leftRoom', (name, updatedInsideRoom) => {
  leftRoomStatus(name, updatedInsideRoom,playerData);

});
