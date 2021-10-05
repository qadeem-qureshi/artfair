import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  TextField, Button, Box, makeStyles, BoxProps,
} from '@material-ui/core';
import clsx from 'clsx';
import socket from '../services/socket';

const useStyles = makeStyles({
  container: {
    padding: '2rem',
    height: '100vh',
    minHeight: '20rem',
    minWidth: '10rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
  },
  button: {
    flexDirection: 'row',
    margin: '.3vw',
  },
  input: {
    flexDirection: 'column',
    margin: 'none',
  },
});

export const ChosenNameContext = React.createContext('');

const Home: React.FC<BoxProps> = (className, ...rest) => {
  const classes = useStyles();
  const [roomInput, setRoomInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const history = useHistory();

  const handleCreateRoom = () => {
    ChosenNameContext.displayName = nameInput;
    socket.emit('user_join', { name: nameInput, gameID: '' });
  };

  const handleJoinRoom = () => {
    ChosenNameContext.displayName = nameInput;
    socket.emit('user_join', { name: nameInput, gameID: roomInput });
  };

  const handleRoomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomInput(event.target.value);
  };

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleGameRoom = useCallback(
    (gameID: string) => {
      history.push(`/room/${gameID}`);
    },
    [history],
  );

  useEffect(() => {
    socket.on('game_room', handleGameRoom);
  }, [handleGameRoom]);

  return (
    <Box className={clsx(classes.container, className)} {...rest}>
      <TextField
        className={classes.input}
        placeholder="Enter a Username..."
        variant="outlined"
        color="primary"
        size="medium"
        spellCheck={false}
        onChange={handleNameInputChange}
        value={nameInput}
      />
      <TextField
        className={classes.input}
        placeholder="Room ID"
        variant="outlined"
        color="primary"
        onChange={handleRoomInputChange}
        size="medium"
        spellCheck={false}
        value={roomInput}
      />
      <Box className={clsx(classes.button, className)} {...rest}>
        <Button
          className={clsx(classes.button)}
          variant="outlined"
          onClick={handleJoinRoom}
          disabled={roomInput.trim().length === 0 || nameInput.trim().length === 0}
        >
          Join Room
        </Button>
        <Button
          className={clsx(classes.button)}
          variant="outlined"
          onClick={handleCreateRoom}
          disabled={nameInput.trim().length === 0}
        >
          Create Room
        </Button>
        <ChosenNameContext.Provider value={nameInput} />
      </Box>
    </Box>
  );
};

export default Home;
