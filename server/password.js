const readline = require('readline');
const io = require('socket.io')();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Listen for password requests
  socket.on('password-request', () => {
    // Use readline to prompt for a password
    rl.question('Enter password: ', (password) => {
      // Send the password back to the client
      socket.emit('password-response', password);
    });
  });
});

io.listen(3001);
