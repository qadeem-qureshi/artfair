import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

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
  socket.broadcast.emit('receive_chat_message', `Client ${socket.id} joined the chat.`);

  socket.on('send_chat_message', (message: string) => {
    socket.broadcast.emit('receive_chat_message', `${socket.id}: ${message}`);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('receive_chat_message', `Client ${socket.id} left the chat.`);
  });
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
