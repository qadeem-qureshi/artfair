import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage, StrokeSegment, UserData, Dot,
} from '@team-2/common';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:1234',
  },
});
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

type UserID = string;
const users = new Map<UserID, UserData>();

app.use(express.static(root));

const addUserJoinListener = (socket: Socket) => {
  socket.on('user_join', (data: UserData) => {
    socket.broadcast.emit('user_join', data.name);
    users.set(socket.id, data);
  });
};

const addUserLeaveListener = (socket: Socket) => {
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.emit('user_leave', userData.name);
    users.delete(socket.id);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => socket.broadcast.emit('chat_message', message));
};

const addDrawSegmentListener = (socket: Socket) => {
  socket.on('draw_segment', (segment: StrokeSegment) => socket.broadcast.emit('draw_segment', segment));
};

const addDrawDotListener = (socket: Socket) => {
  socket.on('draw_dot', (dot: Dot) => socket.broadcast.emit('draw_dot', dot));
};

io.on('connection', (socket) => {
  addUserJoinListener(socket);
  addUserLeaveListener(socket);
  addChatMessageListener(socket);
  addDrawSegmentListener(socket);
  addDrawDotListener(socket);
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
