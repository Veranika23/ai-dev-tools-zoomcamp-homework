const request = require('supertest');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const http = require('http');
const express = require('express');
const uuid = require('uuid');

let app, server, io;

beforeAll((done) => {
  app = express();
  app.use(express.json());
  server = http.createServer(app);
  io = new Server(server);

  // Minimal session logic for test
  const sessions = {};
  app.post('/session', (req, res) => {
    const sessionId = uuid.v4();
    sessions[sessionId] = { code: '', language: 'javascript' };
    res.json({ sessionId });
  });

  io.on('connection', (socket) => {
    socket.on('joinSession', ({ sessionId }) => {
      socket.join(sessionId);
      socket.emit('codeUpdate', sessions[sessionId]);
    });
    socket.on('codeChange', ({ sessionId, code, language }) => {
      sessions[sessionId] = { code, language };
      socket.to(sessionId).emit('codeUpdate', { code, language });
    });
  });

  server.listen(() => done());
});

afterAll((done) => {
  io.close();
  server.close(done);
});

test('Session creation and real-time code update', async () => {
  const res = await request(app).post('/session');
  expect(res.body.sessionId).toBeDefined();
  const sessionId = res.body.sessionId;

  const client1 = ioClient.connect(`http://localhost:${server.address().port}`);
  const client2 = ioClient.connect(`http://localhost:${server.address().port}`);

  await new Promise((resolve) => {
    client2.on('codeUpdate', ({ code, language }) => {
      if (code === 'hello world' && language === 'javascript') {
        client1.disconnect();
        client2.disconnect();
        resolve();
      }
    });

    client1.on('connect', () => {
      client1.emit('joinSession', { sessionId });
    });

    client2.on('connect', () => {
      client2.emit('joinSession', { sessionId });
    });

    client1.on('codeUpdate', () => {
      client1.emit('codeChange', { sessionId, code: 'hello world', language: 'javascript' });
    });
  });
});