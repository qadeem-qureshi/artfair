import React from 'react';
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import App from './components/App';

const socket = io();

socket.on('recieveChatMessage', (_msgRcv: string) => {
  console.log(_msgRcv); // client recieved a message from another client
});

socket.emit('chatMessage', 'Hello'); // send the message to the server

const rootElement = document.getElementById('root');
render(<App />, rootElement);
