import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage,
  StrokeSegment,
  UserData,
  Dot,
  RoomData,
  RoomRequestData,
} from '@artfair/common';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

const users = new Map<string, UserData>();
const rooms = new Map<string, RoomData>();

app.use(express.static(root));

app.get('*', (req, res) => {
  res.redirect('/');
});

const usernameIsTaken = (username: string, room: string) => {
  const roomData = rooms.get(room);
  return roomData && roomData.members.has(username);
};

const addCreateRoomAttemptListener = (socket: Socket) => {
  socket.on('create_room_attempt', (data: RoomRequestData) => {
    if (rooms.has(data.room)) {
      socket.emit('room_taken');
    } else {
      users.set(socket.id, { name: data.username, room: data.room });
      rooms.set(data.room, { name: data.room, members: new Set([data.username]) });
      socket.join(data.room);
      socket.emit('room_created', data);
    }
  });
};

const addJoinRoomAttemptListener = (socket: Socket) => {
  socket.on('join_room_attempt', (data: RoomRequestData) => {
    if (!rooms.has(data.room)) {
      socket.emit('room_does_not_exist');
    } else if (usernameIsTaken(data.username, data.room)) {
      socket.emit('username_taken');
    } else {
      users.set(socket.id, { name: data.username, room: data.room });
      rooms.get(data.room)?.members.add(data.username);
      socket.join(data.room);
      socket.emit('room_joined', data);
      socket.broadcast.to(data.room).emit('user_join', data.username);
    }
  });
};

const addUserLeaveListener = (socket: Socket) => {
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('user_leave', userData.name);

    const roomData = rooms.get(userData.room);
    if (!roomData) return;

    // Remove user from room and delete room if everybody has left
    roomData.members.delete(userData.name);
    if (roomData.members.size === 0) {
      rooms.delete(userData.room);
    }

    users.delete(socket.id);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('chat_message', message);
  });
};

const addDrawSegmentListener = (socket: Socket) => {
  socket.on('draw_segment', (segment: StrokeSegment) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('draw_segment', segment);
  });
};

const addDrawDotListener = (socket: Socket) => {
  socket.on('draw_dot', (dot: Dot) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.room).emit('draw_dot', dot);
  });
};

io.on('connection', (socket) => {
  addCreateRoomAttemptListener(socket);
  addJoinRoomAttemptListener(socket);
  addUserLeaveListener(socket);
  addChatMessageListener(socket);
  addDrawSegmentListener(socket);
  addDrawDotListener(socket);
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
