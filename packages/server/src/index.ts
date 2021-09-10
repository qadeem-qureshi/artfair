import express from 'express';
import * as path from 'path';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = process.env.port || 3000;
const root = path.join(__dirname, '../../client/dist');
const userHashMap = new Map<string, any>();

app.use(express.static(root));

io.on('connection', (_socket: Socket) => {
  console.log('new client connected!');
  _socket.on('gameData', (_data) => {
    userHashMap.set(_socket.id, _data); //  future game data stuff
  });
  _socket.on('chatMessage', (_msgPayload: string) => {
    _socket.broadcast.emit('recieveChatMessage', _socket.id.concat(' ') + _msgPayload); //   send the message (with sender id) to all clients except the sender
  });
});

httpServer.listen(port, () => console.log(`App listening at http://localhost:${port}`));
