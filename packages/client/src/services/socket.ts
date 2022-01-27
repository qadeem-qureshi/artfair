import { io } from 'socket.io-client';

const ip = process.env.REACT_APP_IP;
const port = process.env.REACT_APP_PORT;
const socket = io(`http://${ip}:${port}`);

export default socket;
