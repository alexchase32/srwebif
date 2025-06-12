'use strict';

const express = require('express');
const http = require('http');
const { sdk, clickerRespondedCallback } = require('./sdk');
const app = express();

app.use(express.json());
app.use(express.static('public'));
let connection = null;

// Start a teacher session (initialize SDK and connect)
app.post('/session/start', (req, res) => {
  const version = sdk.smartresponse_sdk_initialize(1);
  if (!version) {
    return res.status(500).json({ error: 'SDK initialization failed' });
  }
  connection = sdk.smartresponse_connectionV1_create(0);
  sdk.smartresponse_connectionV1_connect(connection);
  // Bind clicker responses
  const clickerListener = clickerRespondedCallback((id, questionId, response, ctx) => {
    io.emit('clicker-response', { clickerId: id, questionId, response });
  });
  sdk.smartresponse_connectionV1_listenonclickerresponded(connection, clickerListener, null);
  res.json({ status: 'session started' });
});

// Ask a question (create and start)
app.post('/question', (req, res) => {
  if (!connection) {
    return res.status(400).json({ error: 'Session not started' });
  }
  const { type, choiceCount = 0, text, answer } = req.body;
  const question = sdk.smartresponse_questionV1_create(type, choiceCount);
  if (text) {
    sdk.smartresponse_questionV1_setquestiontext(question, text, -1);
  }
  if (answer) {
    sdk.smartresponse_questionV1_setanswer(question, answer, -1);
  }
  sdk.smartresponse_connectionV1_startquestion(connection, question);
  res.json({ status: 'question started' });
});

const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
