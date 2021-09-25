import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
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
  const [chosenName, setChosenName] = useState('default user');

  const addMessage = useCallback((message: ChatMessage) => {
    // Messages are added to front because elements are rendered in reverse
    setMessages((previous) => [message, ...previous]);
  }, []);

  const handleUserJoin = useCallback(
    (name: string) => {
      addMessage({ sender: '', content: `${name} joined the chat` });
    },
    [addMessage],
  );

  const handleUserLeave = useCallback(
    (name: string) => {
      addMessage({ sender: '', content: `${name} left the chat` });
    },
    [addMessage],
  );

  useEffect(() => {
    socket.on('chat_message', addMessage);
    socket.on('user_join', handleUserJoin);
    socket.on('user_leave', handleUserLeave);
  }, [addMessage, handleUserJoin, handleUserLeave]);

  useLayoutEffect(() => {
    // eslint-disable-next-line no-alert
    const requestedName = prompt('What is your name?');
    if (requestedName) {
      setChosenName(requestedName);
      socket.emit('user_join', { name: requestedName });
    }
  }, [setChosenName]);

  const handleSend = (content: string) => {
    const message: ChatMessage = { sender: chosenName, content };
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
