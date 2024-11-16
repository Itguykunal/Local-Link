// Importing required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');  // To get the local IP address

// Initialize express app
const app = express();

// Create HTTP server using express app
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server);

// Serve static files (for frontend)
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for chat messages and broadcast them to all users
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);  // Broadcast message to everyone
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
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
server.listen(3000, () => {
  if (localIP) {
    console.log(`Server running on http://${localIP}:3000`);
  } else {
    console.log("Server could not detect the local IP address.");
  }
});
