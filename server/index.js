'use strict';
const { Server } = require('socket.io');
// const bcrypt = require('bcrypt');
require('dotenv').config();
const PORT = process.env.PORT || 3003;
const io = new Server(PORT);
let game = io.of('/game');
const {joinLobby, findRole, playerEscape, playerKill, changeRoom,voting} = require('./handler');
// const readline = require('readline');

// const { db, players } = require('../models');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: true,
// });

// db.sync().then(
//   rl.question('Enter your username: ', (username) => {
//     rl.stdoutMuted = true;
//     rl.question('Enter your password: ', (password) => {
//       rl.close();
//       bcrypt.hash(password, 10, (err, hash) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         players.create({
//           username: username,
//           password: hash,
//           gamesPlayed: 0,
//           banned: false,
//           time: Date.now(),
//         })
//           .then((player) => {
//             console.log(`User ${player.username} has been created`);
//           })
//           .catch((err) => {
//             console.error(err);
//           });
//       });
//     });
//   }));

// rl._writeToOutput = (stringToWrite) => {
//   if (rl.stdoutMuted)
//     rl.output.write('*');
//   else
//     rl.output.write(stringToWrite);
// };



let gameData ={
  currentPlayers : [],
  deadArr : [],
  aliveArr : [],
  kickArr : [],
  slayer : null,
  insideRoom : {},
  resultArr : [],
  counts : {},
};
// let currentPlayers = [];
// let deadArr = [];
// let aliveArr = [];
// let kickArr = [];
// let slayer = null;
// let insideRoom = {};
// let resultArr = [];
// let counts = {};
// class Player {
//   constructor(name) {
//     this.name = name;
//     this.role = 'survivor';
//     this.score = 0;
//   }
// }

//server: /game namespace
// socket.emit TO THAT Player
// is it game or socket? .broadcast.emit TO WHOEVER THAT is NOT the sender 
// game.emit TO EVERYONE
game.on('connection', (socket) => {
  console.log('PLAYER CONNECTED TO /game', socket.id);
  socket.on('joinLobby', (name) => {
    joinLobby(name, gameData, socket, game);
  });
  socket.on('myRole', (name) => {
    findRole(name,gameData,socket);
  });

  socket.on('won', (name, currentRoom)=>{
    game.emit('globalEvent', `${name} escaped! (And didn't tell anyone where the exit is... What a *#$%#.)`);
    playerEscape(name, currentRoom, gameData, game);
  });

  socket.on('playerKill', (action) => {
    playerKill(action, gameData, socket, game);
    let msg = `[ALERT] ${action[0]} is found DEAD!`;
    game.emit('vote', msg, gameData.aliveArr);
  });

  socket.on('roomChange', (roomChange, name, prevRoom) => {
    changeRoom(roomChange, name, gameData, socket, game, prevRoom);
    socket.emit('playerAction', 'nth');
  });

  socket.on('voteResult', (vote) => {
    voting(vote, gameData, socket, game);
  });

  socket.on('disconnect', () => {
    if (socket.username === gameData.slayer) {
      game.emit('globalEvent', '[Game Over] Slayer has left the game.');
      game.disconnectSockets(true);
    }
    let idx = gameData.currentPlayers.findIndex(obj => obj.name === socket.username);
    gameData.currentPlayers.splice(idx, 1);
    let msg = `${socket.username} is disconnected.`;
    console.log(msg);
    game.emit('globalEvent', msg);
  });

});
