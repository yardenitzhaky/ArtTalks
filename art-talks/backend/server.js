// Express HTTP server + Socket.IO (Small enough for one file)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const artworks = require('./data');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Don't need .env file for this simple project
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/artworks', (req, res) => {
  res.json({
    success: true,
    data: artworks
  });
});

app.get('/api/artworks/:id', (req, res) => {
  const artworkId = parseInt(req.params.id);
  const artwork = artworks.find(art => art.id === artworkId);
  
  if (!artwork) {
    return res.status(404).json({
      success: false,
      message: 'Artwork not found'
    });
  }
  
  res.json({
    success: true,
    data: artwork
  });
});

// In-memory chat store: artworkId -> messages[]
const chatMessages = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room per artwork; send history if exists
  socket.on('join-discussion', (artworkId) => {
    socket.join(`artwork-${artworkId}`);
    if (chatMessages[artworkId]) {
      socket.emit('previous-messages', chatMessages[artworkId]);
    }
  });

  // Receive, stamp, store, and broadcast message
  socket.on('send-message', (data) => {
    const { artworkId, message, username } = data;
    const messageData = {
      id: Date.now(), 
      message,
      username: username || 'Anonymous',
      timestamp: new Date().toISOString()
    };

    if (!chatMessages[artworkId]) chatMessages[artworkId] = [];
    chatMessages[artworkId].push(messageData);

    io.to(`artwork-${artworkId}`).emit('new-message', messageData);
  });

  // Leave artwork room
  socket.on('leave-discussion', (artworkId) => {
    socket.leave(`artwork-${artworkId}`);
  });

  // Cleanup/log only
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});