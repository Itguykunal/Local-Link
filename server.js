const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os'); // To get the local IP address


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (for frontend)
app.use(express.static('public'));

let activeUsers = 0;

// Handle socket connections
io.on('connection', (socket) => {
  activeUsers++;
  io.emit('updateActiveUsers', activeUsers);  // Emit active users count to all clients
  console.log('User connected');
  console.log('Active users:', activeUsers);

  // Listen for chat messages
  socket.on('chat message', (data) => {
    io.emit('chat message', data);  // Emit the received message to all clients
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    activeUsers--;  // Decrement active users
    io.emit('updateActiveUsers', activeUsers);  // Emit updated active users count
    console.log('User disconnected');
    console.log('Active users:', activeUsers);
  });
});

// Get the local IP address
const networkInterfaces = os.networkInterfaces();
let localIP;

// Find the first non-internal IPv4 address
for (let interfaceName in networkInterfaces) {
  networkInterfaces[interfaceName].forEach((network) => {
    if (network.family === 'IPv4' && !network.internal) {
      localIP = network.address;
    }
  });
}

// Start the server on port 3000
server.listen(3001, () => {
  if (localIP) {
    console.log(`Server running on http://${localIP}:3001`);
  } else {
    console.log("Server could not detect the local IP address.");
  }
});
