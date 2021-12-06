import React, { useCallback, useEffect, useState } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { ChatMessage, MemberData } from '@artfair/common';
import socket from '../services/socket';
import ChatInput from './ChatInput';
import ChatLine from './ChatLine';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  const { state } = useRoomContext();

  const addMessage = useCallback((message: ChatMessage) => {
    // Messages are added to front because elements are rendered in reverse
    setMessages((previous) => [message, ...previous]);
  }, []);

  const handleUserJoin = useCallback(
    (memberData: MemberData) => {
      addMessage({ sender: '', content: `${memberData.name} joined the room` });
    },
    [addMessage],
  );

  const handleUserLeave = useCallback(
    (name: string) => {
      addMessage({ sender: '', content: `${name} left the room` });
    },
    [addMessage],
  );

  const handleSend = (content: string) => {
    const message: ChatMessage = { sender: state.username, content };
    socket.emit('chat_message', message);
    addMessage(message);
  };

  useEffect(() => {
    socket.on('chat_message', addMessage);
    socket.on('user_join', handleUserJoin);
    socket.on('user_leave', handleUserLeave);

    return () => {
      socket.off('chat_message', addMessage);
      socket.off('user_join', handleUserJoin);
      socket.off('user_leave', handleUserLeave);
    };
  }, [addMessage, handleUserJoin, handleUserLeave]);

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
