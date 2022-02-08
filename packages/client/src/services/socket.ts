import { io } from 'socket.io-client';

const HOSTNAME = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;

const socket = io(`http://${HOSTNAME}:${PORT}`);

export default socket;
