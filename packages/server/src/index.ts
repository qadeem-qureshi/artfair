import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage,
  UserData,
  RoomCreationData,
  RoomData,
  MemberData,
  RoomJoinData,
  StrokeBeginData,
  StrokeContinueData,
  StrokeEndData,
} from '@artfair/common';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');

const users = new Map<string, UserData>();
const rooms = new Map<string, RoomData>();

app.use('/', express.static(root));
app.use('*', express.static(root));

const usernameIsTaken = (username: string, roomname: string) => {
  const roomData = rooms.get(roomname);
  return (
    roomData && roomData.members.some((member) => member.name === username)
  );
};

const addCreateRoomAttemptListener = (socket: Socket) => {
  socket.on('create_room_attempt', (userData: UserData) => {
    if (rooms.has(userData.roomname)) {
      socket.emit('room_taken');
    } else {
      const memberData: MemberData = {
        name: userData.name,
        avatarIndex: userData.avatarIndex,
      };
      const roomData: RoomData = { members: [memberData] };
      const roomCreationData: RoomCreationData = {
        username: userData.name,
        roomname: userData.roomname,
      };
      users.set(socket.id, userData);
      rooms.set(userData.roomname, roomData);
      socket.join(userData.roomname);
      socket.emit('room_created', roomCreationData);
    }
  });
};

const addJoinRoomAttemptListener = (socket: Socket) => {
  socket.on('join_room_attempt', (userData: UserData) => {
    if (!rooms.has(userData.roomname)) {
      socket.emit('room_does_not_exist');
    } else if (usernameIsTaken(userData.name, userData.roomname)) {
      socket.emit('username_taken');
    } else {
      const roomData = rooms.get(userData.roomname);
      if (!roomData) return;
      users.set(socket.id, userData);
      const memberData: MemberData = {
        name: userData.name,
        avatarIndex: userData.avatarIndex,
      };
      roomData.members.push(memberData);
      const roomJoinData: RoomJoinData = {
        username: userData.name,
        roomname: userData.roomname,
        roomMembers: roomData.members,
      };
      socket.join(userData.roomname);
      socket.emit('room_joined', roomJoinData);
      socket.broadcast.to(userData.roomname).emit('user_join', memberData);
    }
  });
};

const addStartGameListener = (socket: Socket) => {
  socket.on('start_game', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.roomname).emit('start_game');
  });
};

const addUserLeaveListener = (socket: Socket) => {
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.roomname).emit('user_leave', userData.name);

    const roomData = rooms.get(userData.roomname);
    if (!roomData) return;

    // Remove user from room and delete room if everybody has left
    const index = roomData.members.findIndex(
      (member) => member.name === userData.name,
    );
    roomData.members.splice(index, 1);
    if (roomData.members.length === 0) {
      rooms.delete(userData.roomname);
    }
    users.delete(socket.id);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.roomname).emit('chat_message', message);
  });
};

const addBeginStrokeListener = (socket: Socket) => {
  socket.on('begin_stroke', (strokeBeginData: StrokeBeginData) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast
      .to(userData.roomname)
      .emit('begin_stroke', strokeBeginData);
  });
};

const addContinueStrokeListener = (socket: Socket) => {
  socket.on('continue_stroke', (strokeContinueData: StrokeContinueData) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast
      .to(userData.roomname)
      .emit('continue_stroke', strokeContinueData);
  });
};

const addEndStrokeListener = (socket: Socket) => {
  socket.on('end_stroke', (strokeEndData: StrokeEndData) => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.roomname).emit('end_stroke', strokeEndData);
  });
};

const addClearCanvasListener = (socket: Socket) => {
  socket.on('clear_canvas', () => {
    const userData = users.get(socket.id);
    if (!userData) return;
    socket.broadcast.to(userData.roomname).emit('clear_canvas');
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
