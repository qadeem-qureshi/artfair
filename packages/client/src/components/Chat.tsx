import React, { useCallback, useEffect, useState } from 'react';
import socket from '../services/socket';
import './Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addMessage = useCallback((message) => {
    setMessages([...messages, message]);
  }, [messages]);

  useEffect(() => {
    socket.on('receive_chat_message', addMessage);
  }, [addMessage]);

  const handleSend = () => {
    socket.emit('send_chat_message', input);
    addMessage(`You: ${input}`);
    setInput('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (input && event.key === 'Enter') { handleSend(); }
  };

  return (
    <div className="chatbox">
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <input className="input" type="text" placeholder="type a message..." value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus />
      <button className="button" type="button" onClick={handleSend} disabled={input === ''}>send</button>
      {messages.map((message) => <p className="message">{message}</p>)}
    </div>
  );
};

export default Chat;
