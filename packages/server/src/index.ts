import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage, StrokeSegment, UserData, Dot,
} from '@team-2/common';

import { customAlphabet } from 'nanoid';

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
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoID = customAlphabet(alphabet, 6);

app.use(express.static(root));

const addUserJoinListener = (socket: Socket) => {
  socket.on('user_join', (data: UserData) => {
    let { gameID } = data;
    if (gameID === '' || Array.from(users.values()).filter((user: UserData) => (gameID === user.gameID)).length === 0) {
      gameID = nanoID();
    }
    users.set(socket.id, { name: data.name, gameID });
    socket.join(gameID);
    socket.broadcast.to(gameID).emit('user_join', data.name);
    socket.emit('game_room', gameID);
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
