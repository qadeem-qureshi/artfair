import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  TextField, Button, Box, makeStyles, BoxProps,
} from '@material-ui/core';
import clsx from 'clsx';
import { RoomRequestData } from '@artfair/common';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '15rem',
    gap: '1rem',
  },
});

export type HomeProps = BoxProps;

const Home: React.FC<HomeProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [requestedUsername, setRequestedUsername] = useState('');
  const [requestedRoom, setRequestedRoom] = useState('');
  const [requestedUsernameError, setRequestedUsernameError] = useState('');
  const [requestedRoomError, setRequestedRoomError] = useState('');
  const history = useHistory();
  const { dispatch } = useAppContext();

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedUsernameError('');
    setRequestedUsername(event.target.value.trimLeft());
  };

  const handleRoomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedRoomError('');
    setRequestedRoom(event.target.value.trimLeft());
  };

  const handleCreateRoom = () => {
    socket.emit('create_room_attempt', { username: requestedUsername, room: requestedRoom });
  };

  const handleJoinRoom = () => {
    socket.emit('join_room_attempt', { username: requestedUsername, room: requestedRoom });
  };

  const handleTakenRoom = useCallback(() => {
    setRequestedRoomError('This room already exists.');
  }, []);

  const handleNonexistentRoom = useCallback(() => {
    setRequestedRoomError('This room does not exist.');
  }, []);

  const handleTakenUsername = useCallback(() => {
    setRequestedUsernameError('This username is taken.');
  }, []);

  const handleRoomRequestAccepted = useCallback(
    (data: RoomRequestData) => {
      dispatch({ type: 'initialize-user', username: data.username, room: data.room });
      dispatch({ type: 'set-players', players: data.players, host: data.host });
      history.push('/lobby');
    },
    [dispatch, history],
  );

  useEffect(() => {
    socket.on('room_taken', handleTakenRoom);
    socket.on('room_does_not_exist', handleNonexistentRoom);
    socket.on('username_taken', handleTakenUsername);
    socket.on('room_created', handleRoomRequestAccepted);
    socket.on('room_joined', handleRoomRequestAccepted);
  }, [handleTakenRoom, handleNonexistentRoom, handleTakenUsername, handleRoomRequestAccepted]);

  const textFieldsAreEmpty = requestedUsername.length === 0 || requestedRoom.length === 0;

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <TextField
        label="Username"
        variant="outlined"
        color="primary"
        value={requestedUsername}
        onChange={handleUsernameInputChange}
        spellCheck={false}
        error={requestedUsernameError.length !== 0}
        helperText={requestedUsernameError}
      />
      <TextField
        label="Room"
        color="primary"
        variant="outlined"
        value={requestedRoom}
        onChange={handleRoomInputChange}
        spellCheck={false}
        error={requestedRoomError.length !== 0}
        helperText={requestedRoomError}
      />
      <Button
        onClick={handleCreateRoom}
        disabled={textFieldsAreEmpty}
        variant="contained"
        color="primary"
        size="large"
      >
        Create Room
      </Button>
      <Button
        onClick={handleJoinRoom}
        disabled={textFieldsAreEmpty}
        variant="contained"
        color="primary"
        size="large"
      >
        Join Room
      </Button>
    </Box>
  );
};

export default Home;
