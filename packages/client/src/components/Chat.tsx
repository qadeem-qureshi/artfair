import React, { useCallback, useEffect, useState } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { ChatMessage } from '@team-2/common';
import socket from '../services/socket';
import ChatInput from './ChatInput';
import ChatLine from './ChatLine';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  messageContainer: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  input: {
    marginTop: '1rem',
  },
});

export type ChatProps = BoxProps;

const Chat: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback((message: ChatMessage) => {
    // Messages are added to front because elements are rendered in reverse
    setMessages([message, ...messages]);
  }, [messages]);

  const handleUserJoin = useCallback((user: string) => {
    const message: ChatMessage = { sender: '', content: `${user} joined the chat` };
    addMessage(message);
  }, [addMessage]);

  const handleUserLeave = useCallback((user: string) => {
    const message: ChatMessage = { sender: '', content: `${user} left the chat` };
    addMessage(message);
  }, [addMessage]);

  useEffect(() => {
    socket.on('chat_message', addMessage);
    socket.on('join_chat', handleUserJoin);
    socket.on('leave_chat', handleUserLeave);
  }, [addMessage, handleUserJoin, handleUserLeave]);

  const handleSend = (content: string) => {
    const message: ChatMessage = { sender: socket.id, content };
    socket.emit('chat_message', message);
    addMessage(message);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.messageContainer}>
        {messages.map((message, index) => (
          <ChatLine
            // eslint-disable-next-line react/no-array-index-key
            key={messages.length - index}
            message={message}
          />
        ))}
      </Box>
      <ChatInput className={classes.input} onSend={handleSend} />
    </Box>
  );
};

export default Chat;
