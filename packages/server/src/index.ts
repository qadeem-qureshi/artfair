import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage,
  StrokeBeginData,
  StrokeContinueData,
  StrokeEndData,
  User,
  Room,
  Artist,
  JoinRoomData,
  Activity,
} from '@artfair/common';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

const userMap = new Map<string, User>();
const roomMap = new Map<string, Room>();

app.use('/', express.static(root));
app.use('*', express.static(root));

const usernameIsTaken = (username: string, roomname: string) => {
  const room = roomMap.get(roomname);
  return room && room.members.some((member) => member.name === username);
};

const addCreateRoomAttemptListener = (socket: Socket) => {
  socket.on('create_room_attempt', (user: User) => {
    if (roomMap.has(user.roomname)) {
      socket.emit('room_taken');
    } else {
      const artist: Artist = {
        name: user.name,
        avatarIndex: user.avatarIndex,
      };
      const room: Room = {
        name: user.roomname,
        members: [artist],
        hostname: user.name,
        activity: 'art-collab',
      };
      const joinRoomData: JoinRoomData = { artist, room };
      userMap.set(socket.id, user);
      roomMap.set(user.roomname, room);
      socket.join(user.roomname);
      socket.emit('room_joined', joinRoomData);
    }
  });
};

const addJoinRoomAttemptListener = (socket: Socket) => {
  socket.on('join_room_attempt', (user: User) => {
    if (!roomMap.has(user.roomname)) {
      socket.emit('room_does_not_exist');
    } else if (usernameIsTaken(user.name, user.roomname)) {
      socket.emit('username_taken');
    } else {
      const room = roomMap.get(user.roomname);
      if (!room) return;
      const artist: Artist = { name: user.name, avatarIndex: user.avatarIndex };
      const joinRoomData: JoinRoomData = { artist, room };
      userMap.set(socket.id, user);
      room.members.push(artist);
      socket.join(user.roomname);
      socket.emit('room_joined', joinRoomData);
      socket.broadcast.to(user.roomname).emit('user_join', artist);
    }
  });
};

const addStartGameListener = (socket: Socket) => {
  socket.on('start_game', (activity: Activity) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    const room = roomMap.get(user.roomname);
    if (!room) return;
    room.activity = activity;
    socket.broadcast.to(user.roomname).emit('start_game', activity);
  });
};

const addUserLeaveListener = (socket: Socket) => {
  socket.on('disconnect', () => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('user_leave', user.name);
    const room = roomMap.get(user.roomname);
    if (!room) return;
    const index = room.members.findIndex((member) => member.name === user.name);
    room.members.splice(index, 1);
    if (room.members.length === 0) {
      // Delete room if it is empty
      roomMap.delete(user.roomname);
    } else if (room.hostname === user.name) {
      // Promote a new host if the host left
      const newHostArtist = room.members[0];
      room.hostname = newHostArtist.name;
      socket.broadcast.to(user.roomname).emit('promote_host', room.hostname);
    }
    userMap.delete(socket.id);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('chat_message', message);
  });
};

const addBeginStrokeListener = (socket: Socket) => {
  socket.on('begin_stroke', (strokeBeginData: StrokeBeginData) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('begin_stroke', strokeBeginData);
  });
};

const addContinueStrokeListener = (socket: Socket) => {
  socket.on('continue_stroke', (strokeContinueData: StrokeContinueData) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('continue_stroke', strokeContinueData);
  });
};

const addEndStrokeListener = (socket: Socket) => {
  socket.on('end_stroke', (strokeEndData: StrokeEndData) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('end_stroke', strokeEndData);
  });
};

const addClearCanvasListener = (socket: Socket) => {
  socket.on('clear_canvas', () => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('clear_canvas');
  });
};

io.on('connection', (socket) => {
  addCreateRoomAttemptListener(socket);
  addJoinRoomAttemptListener(socket);
  addUserLeaveListener(socket);
  addChatMessageListener(socket);
  addBeginStrokeListener(socket);
  addContinueStrokeListener(socket);
  addEndStrokeListener(socket);
  addStartGameListener(socket);
  addClearCanvasListener(socket);
});

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
