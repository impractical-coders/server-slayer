'use strict';
// run server with npm run dev (will use nodemon)
const { Server } = require('socket.io');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const io = new Server(PORT);
let game = io.of('/game');

//EVENT Logger
// const date = new Date();
// function logger (eventName, payload){
//   let event = {};
//   event.event = eventName;
//   event.time = date;
//   event.payload = payload;
//   console.log(event);
// }

// game data
let currentPlayers = [];
// let bathroomArr = [];
// let basementArr =[];
// let atticArr =[];
let insideRoom = {};

class Player {
  constructor(name) {
    this.name = name;
    this.role = 'human';
    this.score = 0;
  }
}

// class Room {
//   constructor(roomName, task, ans) {
//     this.roomName = roomName;
//     this.task = task;
//     this.ans = ans;
//   }
// }


//server: /game namespace
// socket.emit TO THAT Player
// is it game or socket? .broadcast.emit TO WHOEVER THAT is NOT the sender 
// game.emit TO EVERYONE
game.on('connection', (socket) => {
  console.log('PLAYER CONNECTED TO /game', socket.id);
  // waiting for players to join the game
  socket.on('joinLobby', (name) => {
    if (currentPlayers.length < 3) {
      // create Obj for each player
      let newPlayer = new Player(name);
      currentPlayers.push(newPlayer);
      game.emit('lobbyStatus', currentPlayers);
      // console.log(`currentPlayers: ${JSON.stringify(currentPlayers, null, 2)}`);
    }
    if (currentPlayers.length === 3) {
      // ramdomly pick a player to be SLAYER
      let slayerIdx = Math.floor(Math.random() * currentPlayers.length);
      currentPlayers[slayerIdx].role = 'slayer';
      // console.log(slayerIdx);
      let msg = 'The game will now start.';
      game.emit('gameStart', msg);
    }
    // let player know what role he is
  });
  socket.on('myRole', (name) => {
    let role = null;
    for (let i = 0; i < currentPlayers.length; i++) {
      if (name === currentPlayers[i].name) {
        role = currentPlayers[i].role;
        // console.log(role);
      }
    }
    socket.emit('myRole', role);
  });


  // room change
  socket.on('roomChange', (roomChange, name , prevRoom = 0) => {
    if (prevRoom !== 0){
      socket.leave(prevRoom);
      let idx = insideRoom[`${prevRoom}`].indexof(name);
      console.log('idx',  idx);
      let updatedInsideRoom = insideRoom[`${prevRoom}`].splice(idx, 1);
      console.log(updatedInsideRoom);
      game.to(prevRoom).emit('leftRoom', name, updatedInsideRoom);
      
    }
    socket.join(roomChange);
    // if (roomChange === 'bathroom'){
    //   bathroomArr.push(name);
    // } else if (roomChange === 'basement'){
    //   basementArr.push(name);
    // } else if (roomChange === 'attic'){
    //   atticArr.push(name);
    // }

    //tracking who is in what room
    if (insideRoom[`${roomChange}`]){
      insideRoom[`${roomChange}`].push(name);
    } else {
      insideRoom[`${roomChange}`] = [];
      insideRoom[`${roomChange}`].push(name);
    }
    let currentRoom = insideRoom[`${roomChange}`];
    // console.log(`currentRoom: ${JSON.stringify(currentRoom, null, 2)}`);
    game.to(roomChange).emit('roomStatus', currentRoom);
  });

  // slayer kill
  game.on('playerKill', (personToBeKilled) => {
    console.log(personToBeKilled);
  });

  // socket.on('status', (payload) => {
  //   game.emit('status', payload);
  //   console.log('back to server: ', payload);
  // });

  //all game .on, .emit needs to be inside this block


});


