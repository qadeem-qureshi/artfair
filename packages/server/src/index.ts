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
    origin: '*',
  },
});
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

type UserID = string;
const users = new Map<UserID, UserData>();

app.use(express.static(root));

const addUserJoinListener = (socket: Socket) => {
  socket.on('user_join', (data: UserData) => {
    users.set(socket.id, data);
    socket.join(data.gameID);
    socket.broadcast.to(data.gameID).emit('user_join', data.name);
    socket.emit('game_room', data.gameID);
  });
};

const addUserLeaveListener = (socket: Socket) => {
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.gameID).emit('user_leave', userData.name);
    users.delete(socket.id);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.gameID).emit('chat_message', message);
  });
};

const addDrawSegmentListener = (socket: Socket) => {
  socket.on('draw_segment', (segment: StrokeSegment) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.gameID).emit('draw_segment', segment);
  });
};

const addDrawDotListener = (socket: Socket) => {
  socket.on('draw_dot', (dot: Dot) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.gameID).emit('draw_dot', dot);
  });
};

io.on('connection', (socket) => {
  addUserJoinListener(socket);
  addUserLeaveListener(socket);
  addChatMessageListener(socket);
  addDrawSegmentListener(socket);
  addDrawDotListener(socket);
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
