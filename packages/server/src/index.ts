import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ChatMessage, CanvasData, GameUser } from '@team-2/common';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:1234',
  },
});
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');
const users = new Map<string, GameUser>();

app.use(express.static(root));

io.on('connection', (socket) => {
  socket.on('canvas_data', (canvasData: CanvasData) => {
    socket.broadcast.emit('canvas_client_data', canvasData);
  });

  socket.on('join_message', (message: ChatMessage) => {
    users.set(socket.id, { userName: message.senderName });
    socket.broadcast.emit('join_chat', message);
  });

  socket.on('chat_message', (message: ChatMessage) => {
    socket.broadcast.emit('chat_message', message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave_chat', users.get(socket.id)?.userName);
    users.delete(socket.id);
  });
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
