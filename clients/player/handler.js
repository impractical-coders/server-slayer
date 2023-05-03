'use strict';
const inquirer = require('inquirer');

function myRole(yourRole, gameSocket, playerData) {
  playerData.role = yourRole;
  console.log(`You are a ${playerData.role.toUpperCase()}`);
  // sending player to a random room
  let rngRoomIdx = Math.floor(Math.random() * playerData.rooms.length);
  gameSocket.emit('roomChange', playerData.rooms[rngRoomIdx], playerData.name);
  playerData.myCurrentRoom = `${playerData.rooms[rngRoomIdx]}`;
  console.log(`Current location: ${playerData.myCurrentRoom}.`);
}

function roomStatus(currentRoomPlayers, thisRoom, playerData) {
  playerData.myCurrentRoom = thisRoom;
  playerData.playersInCurrentRoom = currentRoomPlayers;
  console.log(`Players inside this room: ${currentRoomPlayers.toString()}`);
  // if (currentRoomPlayers.includes(name)){
  //   actionMainList(role);
  // }
}

function leftRoomStatus(name, updatedInsideRoom, playerData) {
  console.log(`${name} has left this room.`);
  let idx = playerData.playersInCurrentRoom.indexOf(updatedInsideRoom);
  playerData.playersInCurrentRoom.splice(idx, 1);
  console.log(`Still in this room: ${playerData.playersInCurrentRoom}`);
}

function vote(alivePlayers, playerData) {
  let players = alivePlayers.filter(i => i !== playerData.name);
  players.push('[ABSTENTION]');
  players.push(new inquirer.Separator());
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Who is the killer?',
        choices: players,
      },
    ])
    .then((answers) => {
      console.log(answers.action);
    });
}

function actionMainList(playerData, gameSocket) {
  if (playerData.role === 'slayer') {
    //TODO: if slayer join a room first, then more ppl join, slayer wont have the option to kill 
    if (playerData.playersInCurrentRoom.length === 1) {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
              'Move to another room',
              new inquirer.Separator()
            ],
          },
        ])
        .then((answers) => {
          playerData.choice = answers.action.charAt(0);
          actionSubList(playerData, gameSocket);
        });
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
              'Move to another room',
              'Kill a player',
              new inquirer.Separator()
            ],
          },
        ])
        .then((answers) => {
          playerData.choice = answers.action.charAt(0);
          actionSubList(playerData, gameSocket);
        });
    }
  } else if (playerData.role === 'survivor') {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            'Move to another room',
            'Look around',
            new inquirer.Separator()
          ],
        },
      ])
      .then((answers) => {
        playerData.choice = answers.action.charAt(0);
        actionSubList(playerData, gameSocket);
      });
  }
}


function actionSubList(playerData, gameSocket) {
  //Move to another room
  if (playerData.choice === 'M') {
    playerData.myPrevRoom = playerData.myCurrentRoom;
    let newRooms = playerData.rooms.filter(i => i !== playerData.myCurrentRoom);
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
        playerData.choice = answers.action;
        playerData.myCurrentRoom = playerData.choice;
        gameSocket.emit('roomChange', playerData.choice, playerData.name, playerData.myPrevRoom);
        // console.log('155 my current room', myCurrentRoom);
      });
  } else if (playerData.choice === 'K') {
    //Kill a player
    let userArr = playerData.playersInCurrentRoom.filter(i => i !== playerData.name);
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
  } else if (playerData.choice === 'L') {
    //look around
    console.log('There is nothing here.');
    //TODO: needs to go back to the action list / rng events, like u found a key, u fond an exit, but it is locked
  }

}

module.exports = {
  vote,
  actionMainList,
  actionSubList,
  leftRoomStatus,
  roomStatus,
  myRole
};