'use strict';
// run server with npm run dev (will use nodemon)
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const io = new Server(PORT);
let game = io.of('/game');

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
let deadArr = [];
let aliveArr = [];
let kickArr = [];
let slayer = null;
let insideRoom = {};
let resultArr = [];
let counts = {};
class Player {
  constructor(name) {
    this.name = name;
    this.role = 'survivor';
    this.score = 0;
  }
}


//server: /game namespace
// socket.emit TO THAT Player
// is it game or socket? .broadcast.emit TO WHOEVER THAT is NOT the sender 
// game.emit TO EVERYONE
game.on('connection', (socket) => {
  console.log('PLAYER CONNECTED TO /game', socket.id);
  // waiting for players to join the game

  socket.on('joinLobby', (name) => {
    socket.username = name;
    if (currentPlayers.length < 4) {
      aliveArr.push(name);

      // create Obj for each player
      let newPlayer = new Player(name);
      currentPlayers.push(newPlayer);
      game.emit('lobbyStatus', currentPlayers);
      // console.log(`currentPlayers: ${JSON.stringify(currentPlayers, null, 2)}`);
    }
    if (currentPlayers.length === 4) {
      // ramdomly pick a player to be SLAYER
      let slayerIdx = Math.floor(Math.random() * currentPlayers.length);
      slayer = currentPlayers[slayerIdx].name;
      currentPlayers[slayerIdx].role = 'slayer';
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
      }
    }
    socket.emit('myRole', role);
  });

  socket.on('won', (name, currentRoom)=>{
    game.emit('globalEvent', `${name} escaped! (And didn't tell anyone where the exit is... What a *#$%#.)`);
    for (let i = 0; i < currentPlayers.length; i++) {
      if (name === currentPlayers[i].name) {
        currentPlayers[i].role = 'escaped';
      }
    }
    let idx0 = insideRoom[currentRoom].indexOf(name);
    let updatedInsideRoom = insideRoom[currentRoom].splice(idx0, 1);
    game.to(currentRoom).emit('roomStatus', updatedInsideRoom, currentRoom);
    let idx = aliveArr.indexOf(name);
    aliveArr.splice(idx, 1);
    if (aliveArr.length === 1 && aliveArr.includes(slayer)){
      let msg = `[Game Over] Last survivor escaped, Slayer ${slayer} lost!`;
      game.emit('globalEvent', msg);
      game.disconnectSockets(true);
    }
    if (aliveArr.length === 2 && aliveArr.includes(slayer)){
      let msg = 'Sudden Death: Last survivor must find the exit beofre the slayer finds you!';
      game.emit('globalEvent', msg);
    }
  });

  // slayer kill
  socket.on('playerKill', (action) => {
    for (let i = 0; i < currentPlayers.length; i++) {
      if (action[0] === currentPlayers[i].name) {
        currentPlayers[i].role = 'dead';
      }
    }
    // console.log(`130 rooms status: ${JSON.stringify(insideRoom, null, 2)}`);
    let idx0 = insideRoom[`${action[1]}`].indexOf(action[0]);
    let updatedInsideRoom = insideRoom[`${action[1]}`].splice(idx0, 1);
    game.to(`${action[1]}`).emit('roomStatus', updatedInsideRoom, `${action[1]}`);
    // console.log(`130 rooms status AFTER: ${JSON.stringify(insideRoom, null, 2)}`);
    // console.log('139', currentPlayers);
    deadArr.push(action[0]);
    let idx = aliveArr.indexOf(action[0]);
    aliveArr.splice(idx, 1);
    // console.log('dead', deadArr);
    // console.log('alive140', aliveArr);
    if (aliveArr.length === 1){
      socket.broadcast.emit('globalEvent', 'You have been killed!');
      let msg = `[Game Over] No more survivor, Slayer ${slayer} won!`;
      game.emit('globalEvent', msg);
      return game.disconnectSockets(true);
    }
    let msg = `[ALERT] ${action[0]} is found DEAD!`;
    game.emit('vote', msg, aliveArr);
  });

  // room change
  socket.on('roomChange', (roomChange, name, prevRoom = 0) => {
    if (prevRoom !== 0) {
      socket.leave(prevRoom);
      // let newInsideRoom = insideRoom[`${prevRoom}`].filter(i => i !== name);
      let idx = insideRoom[`${prevRoom}`].indexOf(name);
      let updatedInsideRoom = insideRoom[`${prevRoom}`].splice(idx, 1);
      // console.log(updatedInsideRoom);
      game.to(prevRoom).emit('leftRoom', name, updatedInsideRoom);

    }
    socket.join(roomChange);
    //tracking who is in what room
    if (insideRoom[`${roomChange}`]) {
      insideRoom[`${roomChange}`].push(name);
    } else {
      insideRoom[`${roomChange}`] = [];
      insideRoom[`${roomChange}`].push(name);
    }
    let currentRoomPlayers = insideRoom[`${roomChange}`];
    // console.log(`currentRoom: ${JSON.stringify(currentRoom, null, 2)}`);
    game.to(roomChange).emit('roomStatus', currentRoomPlayers, roomChange);
    socket.emit('playerAction', 'nth');
  });

  socket.on('voteResult', (vote) => {
    // console.log('165res', resultArr.length);
    resultArr.push(vote);
    // console.log('vote', resultArr);
    // console.log(`vote results ${JSON.stringify(counts, null, 2)}`);
    // console.log(aliveArr);

    if (resultArr.length === aliveArr.length) {
      resultArr.forEach(element => {
        counts[element] = (counts[element] || 0) + 1;
      });

      console.log(`vote results ${JSON.stringify(counts, null, 2)}`);
      let maxVotes = 0;
      let maxVotePlayer = [];
      let prevVoteCount = null;
      for (let player in counts) {
        const voteCount = counts[player];
        if (prevVoteCount === null) {
          prevVoteCount = voteCount;
        }
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          maxVotePlayer = [player];
        } else if (voteCount === maxVotes) {
          maxVotePlayer.push(player);
        }
      }
      // console.log('maxVotePlayer', maxVotePlayer);
      if (maxVotePlayer.length > 1) {
        let msg = `TIED: Nobody got kicked out. Game continues...`;
        game.emit('globalEvent', msg);
        // game.to(roomChange).emit('roomStatus', currentRoomPlayers, roomChange);
        socket.emit('playerAction', 'nth');
      } else {
        if (maxVotePlayer[0] === slayer) {
          let msg = `[Game Over] Congratulations, SLAYER has been caught!`;
          game.emit('globalEvent', msg);
          game.disconnectSockets(true);
        } else if (maxVotePlayer[0] === '[SKIP]'){
          let msg = `Nobody got kicked out. Game continues...`;
          game.emit('globalEvent', msg);
        } else {
          let msg = `${maxVotePlayer[0]} has been kicked out, but SLAYER is still out there! Game continues...`;
          for (let i = 0; i < currentPlayers.length; i++) {
            if (maxVotePlayer[0] === currentPlayers[i].name) {
              currentPlayers[i].role = 'kicked';
            }
          }
          let room = null;
          for (const key in insideRoom) {
            if (Array.isArray(insideRoom[key]) && insideRoom[key].includes(maxVotePlayer[0])) {
              room = key;
            }
          }
          let idx0 = insideRoom[room].indexOf(maxVotePlayer[0]);
          let updatedInsideRoom = insideRoom[room].splice(idx0, 1);
          game.to(room).emit('roomStatus', updatedInsideRoom, room);
          kickArr.push(maxVotePlayer[0]);
          console.log(aliveArr);
          let idx = aliveArr.indexOf(maxVotePlayer[0]);
          aliveArr.splice(idx, 1);
          console.log(aliveArr);
          game.emit('globalEvent', msg);
          if (aliveArr.length === 2){
            let msg = 'Sudden Death: Last survivor must find the exit beofre the slayer finds you!';
            game.emit('globalEvent', msg);
          }
        }
        // game.to(roomChange).emit('roomStatus', currentRoomPlayers, roomChange);
        game.emit('playerAction', 'nth');
      }
      game.emit('voteResult', maxVotePlayer);
      resultArr = [];
      counts = {};
    }
  });

  // socket.on('status', (payload) => {
  //   game.emit('status', payload);
  //   console.log('back to server: ', payload);
  // });
  socket.on('disconnect', () => {
    if (socket.username === slayer) {
      game.emit('globalEvent', '[Game Over] Slayer has left the game.');
      game.disconnectSockets(true);
    }
    let idx = currentPlayers.findIndex(obj => obj.name === socket.username);
    // console.log(`BEFORE: ${JSON.stringify(currentPlayers, null, 2)}`);
    currentPlayers.splice(idx, 1);
    // console.log('193',aliveArr);
    // let idx2 = aliveArr.indexOf(socket.username);
    // aliveArr.splice(idx2, 1);
    // console.log('194',aliveArr);
    // console.log(`AFTER: ${JSON.stringify(currentPlayers, null, 2)}`);
    let msg = `${socket.username} is disconnected.`;
    console.log(msg);
    game.emit('globalEvent', msg);
  });
  //all game .on, .emit needs to be inside this block


});



