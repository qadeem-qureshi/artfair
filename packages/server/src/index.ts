import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ChatMessage } from '@team-2/common';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:1234',
  },
});
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

app.use(express.static(root));

io.on('connection', (socket) => {
  socket.broadcast.emit('join_chat', socket.id);

  socket.on('chat_message', (message: ChatMessage) => {
    socket.broadcast.emit('chat_message', message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave_chat', socket.id);
  });
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
