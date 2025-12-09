const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Store sessions and code
const sessions = {};

app.post('/session', (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { code: '', language: 'javascript' };
  res.json({ sessionId });
});

io.on('connection', (socket) => {
  socket.on('joinSession', ({ sessionId }) => {
    socket.join(sessionId);
    // Send current code to the new user
    socket.emit('codeUpdate', sessions[sessionId]);
  });

  socket.on('codeChange', ({ sessionId, code, language }) => {
    sessions[sessionId] = { code, language };
    socket.to(sessionId).emit('codeUpdate', { code, language });
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});