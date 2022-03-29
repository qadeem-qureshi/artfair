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
  DEFAULT_ACTIVITY,
  DEFAULT_STAGE,
} from '@artfair/common';

const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const root = path.join(__dirname, '../../client/dist');

const userMap = new Map<string, User>();
const roomMap = new Map<string, Room>();

app.use('/', express.static(root));
app.get('*', (req, res) => res.redirect('/'));

const usernameIsTaken = (username: string, roomname: string) => {
  const room = roomMap.get(roomname);
  return room && room.members.some((member) => member.name === username);
};

const addCreateRoomAttemptListener = (socket: Socket) => {
  socket.on('create_room_attempt', (user: User) => {
    if (roomMap.has(user.roomname)) {
      socket.emit('room_taken');
      console.info(`User [${user.name}] attempted to create existing room [${user.roomname}].`);
    } else {
      const artist: Artist = {
        name: user.name,
        avatarIndex: user.avatarIndex,
        stage: DEFAULT_STAGE,
      };
      const room: Room = {
        name: user.roomname,
        members: [artist],
        hostname: user.name,
        activity: DEFAULT_ACTIVITY,
        stage: DEFAULT_STAGE,
      };
      const joinRoomData: JoinRoomData = { artist, room };
      userMap.set(socket.id, user);
      roomMap.set(user.roomname, room);
      socket.join(user.roomname);
      socket.emit('room_joined', joinRoomData);
      console.info(`User [${user.name}] created room [${user.roomname}].`);
    }
  });
};

const addJoinRoomAttemptListener = (socket: Socket) => {
  socket.on('join_room_attempt', (user: User) => {
    if (!roomMap.has(user.roomname)) {
      socket.emit('room_does_not_exist');
      console.info(`User [${user.name}] attempted to join nonexistent room [${user.roomname}].`);
    } else if (usernameIsTaken(user.name, user.roomname)) {
      socket.emit('username_taken');
      console.info(`User [${user.name}] attempted to join room [${user.roomname}] with a taken username.`);
    } else {
      const room = roomMap.get(user.roomname);
      if (!room) return;
      const artist: Artist = {
        name: user.name,
        avatarIndex: user.avatarIndex,
        stage: 'lobby',
      };
      const joinRoomData: JoinRoomData = { artist, room };
      userMap.set(socket.id, user);
      room.members.push(artist);
      socket.join(user.roomname);
      socket.emit('room_joined', joinRoomData);
      socket.broadcast.to(user.roomname).emit('artist_join', artist);
      console.info(`User [${user.name}] joined room [${user.roomname}].`);
    }
  });
};

const addStartActivityListener = (socket: Socket) => {
  socket.on('start_activity', (activity: Activity) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    const room = roomMap.get(user.roomname);
    if (!room) return;
    // Only the actual host can start activity
    if (room.hostname !== user.name) return;
    room.activity = activity;
    room.members = room.members.map((member) => ({ ...member, stage: 'activity' }));
    room.stage = 'activity';
    socket.broadcast.to(user.roomname).emit('start_activity', activity);
    console.info(`Host [${user.name}] of room [${user.roomname}] began activity [${activity}].`);
  });
};

const addEndActivityListener = (socket: Socket) => {
  socket.on('end_activity', () => {
    const user = userMap.get(socket.id);
    if (!user) return;
    const room = roomMap.get(user.roomname);
    if (!room) return;
    // Only the actual host can end activity
    if (room.hostname !== user.name) return;
    room.activity = DEFAULT_ACTIVITY;
    room.members = room.members.map((member) => ({ ...member, stage: DEFAULT_STAGE }));
    room.stage = DEFAULT_STAGE;
    socket.broadcast.to(user.roomname).emit('end_activity');
    console.info(`Host [${user.name}] of room [${user.roomname}] ended the current activity.`);
  });
};

const addStartDiscussionListener = (socket: Socket) => {
  socket.on('start_discussion', () => {
    const user = userMap.get(socket.id);
    if (!user) return;
    const room = roomMap.get(user.roomname);
    if (!room) return;
    // Only the actual host can start discussion
    if (room.hostname !== user.name) return;
    room.members = room.members.map((member) => ({
      ...member,
      stage: member.stage === room.stage ? 'discussion' : member.stage,
    }));
    room.stage = 'discussion';
    socket.broadcast.to(user.roomname).emit('start_discussion');
    console.info(`Host [${user.name}] of room [${user.roomname}] began discussion.`);
  });
};

const getArtistLeaveHandler = (socket: Socket) => () => {
  const user = userMap.get(socket.id);
  if (!user) return;
  const room = roomMap.get(user.roomname);
  if (!room) return;
  const index = room.members.findIndex((member) => member.name === user.name);
  if (index === -1) {
    userMap.delete(socket.id);
    return;
  }
  socket.broadcast.to(user.roomname).emit('artist_leave', user.name);
  console.info(`User [${user.name}] left room [${user.roomname}].`);
  room.members.splice(index, 1);
  if (room.members.length === 0) {
    // Delete room if it is empty
    roomMap.delete(user.roomname);
    console.info(`Room [${user.roomname}] was deleted.`);
  } else if (room.hostname === user.name) {
    // Promote a new host if the host left
    const artistWithHost = room.members.find((member) => member.stage === room.stage);
    if (artistWithHost) {
      // If another artist is in the same stage as the host, promote them
      room.hostname = artistWithHost.name;
    } else {
      // Otherwise, end the activity and promote someone else
      room.activity = DEFAULT_ACTIVITY;
      room.stage = DEFAULT_STAGE;
      socket.broadcast.to(user.roomname).emit('end_activity');
      console.info(`The activity in room [${user.roomname}] was ended automatically.`);
      room.hostname = room.members[0].name;
    }
    socket.broadcast.to(user.roomname).emit('promote_host', room.hostname);
    console.info(`User [${room.hostname}] was automatically promoted to host of room [${user.roomname}].`);
  }
  userMap.delete(socket.id);
};

const addDisconnectListener = (socket: Socket) => {
  socket.on('disconnect', getArtistLeaveHandler(socket));
};

const addPromoteHostListener = (socket: Socket) => {
  socket.on('promote_host', (hostname: string) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    const room = roomMap.get(user.roomname);
    if (!room) return;
    // No need to promote the host twice
    if (room.hostname === hostname) return;
    // Make sure that only the actual host can promote :)
    if (room.hostname !== user.name) return;
    if (room.members.some((member) => member.name === hostname)) {
      room.hostname = hostname;
      // Send to everyone in the room, including previous host
      io.in(user.roomname).emit('promote_host', room.hostname);
      console.info(`Host [${user.name}] promoted user [${room.hostname}] in room [${user.roomname}].`);
    }
  });
};

const addLeaveListener = (socket: Socket) => {
  socket.on('artist_leave', getArtistLeaveHandler(socket));
};

const addKickListener = (socket: Socket) => {
  socket.on('kick_artist', (username: string) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    const room = roomMap.get(user.roomname);
    if (!room) return;
    // Never kick the host
    if (room.hostname === username) return;
    // Only the actual host can kick
    if (room.hostname !== user.name) return;
    const index = room.members.findIndex((member) => member.name === username);
    if (index === -1) return;
    room.members.splice(index, 1);
    // Send to everyone in the room, including host
    io.in(user.roomname).emit('kick_artist', username);
    console.info(`User [${username}] was kicked from room [${user.roomname}].`);
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('chat_message', message);
    console.info(`User [${user.name}] sent a chat message in room [${user.roomname}].`);
  });
};

const addBeginStrokeListener = (socket: Socket) => {
  socket.on('begin_stroke', (strokeBeginData: StrokeBeginData) => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('begin_stroke', strokeBeginData);
    console.info(`User [${user.name}] began a stroke in room [${user.roomname}].`);
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
    console.info(`User [${user.name}] ended a stroke in room [${user.roomname}].`);
  });
};

const addClearCanvasListener = (socket: Socket) => {
  socket.on('clear_canvas', () => {
    const user = userMap.get(socket.id);
    if (!user) return;
    socket.broadcast.to(user.roomname).emit('clear_canvas');
    console.info(`User [${user.name}] cleared the canvas in room [${user.roomname}].`);
  });
};

io.on('connection', (socket) => {
  addCreateRoomAttemptListener(socket);
  addJoinRoomAttemptListener(socket);
  addDisconnectListener(socket);
  addPromoteHostListener(socket);
  addKickListener(socket);
  addLeaveListener(socket);
  addChatMessageListener(socket);
  addBeginStrokeListener(socket);
  addContinueStrokeListener(socket);
  addEndStrokeListener(socket);
  addStartActivityListener(socket);
  addEndActivityListener(socket);
  addStartDiscussionListener(socket);
  addClearCanvasListener(socket);
});

server.listen(PORT, HOSTNAME, undefined, () => console.log(`App listening at http://${HOSTNAME}:${PORT}`));
