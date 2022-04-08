import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ChatMessage,
  StrokeBeginData,
  StrokeContinueData,
  StrokeEndData,
  Room,
  Artist,
  JoinRoomData,
  Activity,
  DEFAULT_ACTIVITY,
  DEFAULT_STAGE,
  LoginData,
} from '@artfair/common';
import { CON_ARTIST_PROMPT, getRandomPrompt } from './prompt';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Path to client bundle
const root = path.join(__dirname, '../../client/dist');

// Serve static content
app.use('/', express.static(root));

// Redirect all requests to root
app.get('*', (req, res) => res.redirect('/'));

// Map of connected socket IDs to artists
const artistMap = new Map<string, Artist>();

// Map of room names to rooms
const roomMap = new Map<string, Room>();

const usernameIsTaken = (username: string, roomname: string) => {
  const room = roomMap.get(roomname);
  return room && room.members.some((member) => member.name === username);
};

const addCreateRoomAttemptListener = (socket: Socket) => {
  socket.on('create_room_attempt', (loginData: LoginData) => {
    if (roomMap.has(loginData.roomname)) {
      socket.emit('room_taken');

      console.info(
        `Artist [${loginData.name}] attempted to create existing room [${loginData.roomname}].`,
      );
    } else {
      const artist: Artist = {
        name: loginData.name,
        avatarIndex: loginData.avatarIndex,
        stage: DEFAULT_STAGE,
        roomname: loginData.roomname,
      };

      const room: Room = {
        name: loginData.roomname,
        members: [artist],
        hostname: loginData.name,
        activity: DEFAULT_ACTIVITY,
        stage: DEFAULT_STAGE,
      };

      const joinRoomData: JoinRoomData = { artist, room };

      artistMap.set(socket.id, artist);
      roomMap.set(loginData.roomname, room);

      socket.join(loginData.roomname);
      socket.emit('room_joined', joinRoomData);

      console.info(
        `Artist [${loginData.name}] created room [${loginData.roomname}].`,
      );
    }
  });
};

const addJoinRoomAttemptListener = (socket: Socket) => {
  socket.on('join_room_attempt', (loginData: LoginData) => {
    if (!roomMap.has(loginData.roomname)) {
      socket.emit('room_does_not_exist');

      console.info(
        `Artist [${loginData.name}] attempted to join nonexistent room [${loginData.roomname}].`,
      );
    } else if (usernameIsTaken(loginData.name, loginData.roomname)) {
      socket.emit('username_taken');

      console.info(
        `Artist [${loginData.name}] attempted to join room [${loginData.roomname}] with a taken username.`,
      );
    } else {
      const room = roomMap.get(loginData.roomname);
      if (!room) return;

      const artist: Artist = {
        name: loginData.name,
        avatarIndex: loginData.avatarIndex,
        stage: 'lobby',
        roomname: loginData.roomname,
      };

      const joinRoomData: JoinRoomData = { artist, room };

      artistMap.set(socket.id, artist);
      room.members.push(artist);

      socket.join(loginData.roomname);
      socket.emit('room_joined', joinRoomData);
      socket.broadcast.to(loginData.roomname).emit('artist_join', artist);

      console.info(
        `Artist [${loginData.name}] joined room [${loginData.roomname}].`,
      );
    }
  });
};

// Return map of the socket IDs of artists in the given room to their corresponding prompt
const getPromptMap = (room: Room): Map<string, string | undefined> => {
  const promptMap = new Map<string, string | undefined>();
  const socketIds = io.of('/').adapter.rooms.get(room.name);
  const participantIds: string[] = [];
  const defaultPrompt = getRandomPrompt(room.activity);

  // Add each participating artist with the default prompt to the map
  socketIds?.forEach((socketId) => {
    if (artistMap.get(socketId)?.stage === room.stage) {
      promptMap.set(socketId, defaultPrompt);
      participantIds.push(socketId);
    } else {
      promptMap.set(socketId, undefined);
    }
  });

  // For the con artist activity, select one participating artist to be the con artist
  if (room.activity === 'con-artist') {
    const conArtistId = participantIds[Math.floor(Math.random() * participantIds.length)];
    promptMap.set(conArtistId, CON_ARTIST_PROMPT);
  }

  return promptMap;
};

const addStartActivityListener = (socket: Socket) => {
  socket.on('start_activity', (activity: Activity) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    const room = roomMap.get(artist.roomname);
    if (!room) return;

    // Only the host may start the activity
    if (artist.name !== room.hostname) return;

    room.activity = activity;
    room.members.forEach((member) => {
      if (member.stage === room.stage) {
        member.stage = 'activity';
      }
    });
    room.stage = 'activity';

    // Tell each artist in room to begin the activity with the given prompt
    getPromptMap(room).forEach((prompt, socketId) => io.to(socketId).emit('start_activity', activity, prompt));

    console.info(
      `Host [${artist.name}] of room [${artist.roomname}] began activity [${activity}].`,
    );
  });
};

const addStartDiscussionListener = (socket: Socket) => {
  socket.on('start_discussion', () => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    const room = roomMap.get(artist.roomname);
    if (!room) return;

    // Only the host may start the discussion
    if (artist.name !== room.hostname) return;

    room.members.forEach((member) => {
      if (member.stage === room.stage) {
        member.stage = 'discussion';
      }
    });
    room.stage = 'discussion';

    socket.broadcast.to(artist.roomname).emit('start_discussion');

    console.info(
      `Host [${artist.name}] of room [${artist.roomname}] began discussion.`,
    );
  });
};

const addEndDiscussionListener = (socket: Socket) => {
  socket.on('end_discussion', () => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    const room = roomMap.get(artist.roomname);
    if (!room) return;

    // Only the host may end the discussion
    if (artist.name !== room.hostname) return;

    room.activity = DEFAULT_ACTIVITY;
    room.members.forEach((member) => {
      if (member.stage === room.stage) {
        member.stage = DEFAULT_STAGE;
      }
    });
    room.stage = DEFAULT_STAGE;

    socket.broadcast.to(artist.roomname).emit('end_discussion');

    console.info(
      `Host [${artist.name}] of room [${artist.roomname}] ended discussion.`,
    );
  });
};

const getArtistLeaveHandler = (socket: Socket) => () => {
  const artist = artistMap.get(socket.id);
  if (!artist) return;

  const room = roomMap.get(artist.roomname);
  if (!room) return;

  // Remove artist from room
  const index = room.members.findIndex((member) => member.name === artist.name);
  if (index !== -1) room.members.splice(index, 1);

  // Remove artist from map
  artistMap.delete(socket.id);

  socket.leave(room.name);
  socket.broadcast.to(artist.roomname).emit('artist_leave', artist.name);

  console.info(`Artist [${artist.name}] left room [${artist.roomname}].`);

  // Delete room if it is empty
  if (room.members.length === 0) {
    roomMap.delete(artist.roomname);

    console.info(`Room [${artist.roomname}] was deleted.`);

    // Promote a new host if the host left
  } else if (room.hostname === artist.name) {
    const artistWithHost = room.members.find(
      (member) => member.stage === room.stage,
    );

    // If another artist is in the same stage as the host, promote them
    if (artistWithHost) {
      room.hostname = artistWithHost.name;

      // Otherwise, end the activity and promote someone else
    } else {
      room.activity = DEFAULT_ACTIVITY;
      room.stage = DEFAULT_STAGE;
      room.hostname = room.members[0].name;

      socket.broadcast.to(artist.roomname).emit('end_activity');

      console.info(
        `The activity in room [${artist.roomname}] was ended automatically.`,
      );
    }

    socket.broadcast.to(artist.roomname).emit('promote_host', room.hostname);

    console.info(
      `Artist [${room.hostname}] was automatically promoted to host of room [${artist.roomname}].`,
    );
  }
};

const addDisconnectListener = (socket: Socket) => {
  socket.on('disconnect', getArtistLeaveHandler(socket));
};

const addPromoteHostListener = (socket: Socket) => {
  socket.on('promote_host', (hostname: string) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    const room = roomMap.get(artist.roomname);
    if (!room) return;

    // No need to promote the host twice
    if (room.hostname === hostname) return;

    // Only the host may promote others
    if (artist.name !== room.hostname) return;

    // Promote host if they exist
    if (room.members.some((member) => member.name === hostname)) {
      room.hostname = hostname;

      // Inform everyone in the room of the new host, including the old host
      io.in(artist.roomname).emit('promote_host', room.hostname);

      console.info(
        `Host [${artist.name}] promoted artist [${room.hostname}] in room [${artist.roomname}].`,
      );
    }
  });
};

const addLeaveListener = (socket: Socket) => {
  socket.on('artist_leave', getArtistLeaveHandler(socket));
};

const addKickListener = (socket: Socket) => {
  socket.on('kick_artist', (username: string) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    const room = roomMap.get(artist.roomname);
    if (!room) return;

    // Never kick the host
    if (username === room.hostname) return;

    // Only the host may kick others
    if (artist.name !== room.hostname) return;

    // Remove artist from room
    const index = room.members.findIndex((member) => member.name === username);
    if (index !== -1) room.members.splice(index, 1);

    // Inform everyone in the room of who was kicked, including the host
    io.in(artist.roomname).emit('kick_artist', username);

    console.info(
      `Artist [${username}] was kicked from room [${artist.roomname}].`,
    );
  });
};

const addChatMessageListener = (socket: Socket) => {
  socket.on('chat_message', (message: ChatMessage) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    socket.broadcast.to(artist.roomname).emit('chat_message', message);

    console.info(
      `Artist [${artist.name}] sent a chat message in room [${artist.roomname}].`,
    );
  });
};

const addBeginStrokeListener = (socket: Socket) => {
  socket.on('begin_stroke', (strokeBeginData: StrokeBeginData) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    socket.broadcast.to(artist.roomname).emit('begin_stroke', strokeBeginData);
  });
};

const addContinueStrokeListener = (socket: Socket) => {
  socket.on('continue_stroke', (strokeContinueData: StrokeContinueData) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    socket.broadcast
      .to(artist.roomname)
      .emit('continue_stroke', strokeContinueData);
  });
};

const addEndStrokeListener = (socket: Socket) => {
  socket.on('end_stroke', (strokeEndData: StrokeEndData) => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    socket.broadcast.to(artist.roomname).emit('end_stroke', strokeEndData);
  });
};

const addClearCanvasListener = (socket: Socket) => {
  socket.on('clear_canvas', () => {
    const artist = artistMap.get(socket.id);
    if (!artist) return;

    socket.broadcast.to(artist.roomname).emit('clear_canvas');

    console.info(
      `Artist [${artist.name}] cleared the canvas in room [${artist.roomname}].`,
    );
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
  addStartDiscussionListener(socket);
  addEndDiscussionListener(socket);
  addClearCanvasListener(socket);
});

server.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
