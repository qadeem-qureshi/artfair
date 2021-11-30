import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, BoxProps, Button, makeStyles, TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import { RoomCreationData, RoomJoinData } from '@artfair/common';
import { useHistory } from 'react-router-dom';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';
import AvatarSelector from './AvatarSelector';

export type LoginProps = BoxProps;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '1rem',
  },
});

const Login: React.FC<LoginProps> = ({ className, ...rest }) => {
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

  const handleCreateRoomAttempt = () => {
    socket.emit('create_room_attempt', {
      username: requestedUsername,
      room: requestedRoom,
    });
  };

  const handleJoinRoomAttempt = () => {
    socket.emit('join_room_attempt', {
      username: requestedUsername,
      room: requestedRoom,
    });
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

  const handleRoomCreated = useCallback(
    (data: RoomCreationData) => {
      dispatch({
        type: 'create-room',
        username: data.username,
        room: data.room,
      });
      history.push('/lobby');
    },
    [dispatch, history],
  );

  const handleRoomJoined = useCallback(
    (data: RoomJoinData) => {
      dispatch({
        type: 'join-room',
        username: data.username,
        room: data.room,
        players: data.players,
      });
      history.push('/lobby');
    },
    [dispatch, history],
  );

  useEffect(() => {
    socket.on('room_taken', handleTakenRoom);
    socket.on('room_does_not_exist', handleNonexistentRoom);
    socket.on('username_taken', handleTakenUsername);
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);

    return () => {
      socket.off('room_taken', handleTakenRoom);
      socket.off('room_does_not_exist', handleNonexistentRoom);
      socket.off('username_taken', handleTakenUsername);
      socket.off('room_created', handleRoomCreated);
      socket.off('room_joined', handleRoomJoined);
    };
  }, [
    handleTakenRoom,
    handleNonexistentRoom,
    handleTakenUsername,
    handleRoomCreated,
    handleRoomJoined,
  ]);

  const textFieldsAreEmpty = requestedUsername.length === 0 || requestedRoom.length === 0;

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <AvatarSelector />
      <TextField
        placeholder="Username"
        variant="outlined"
        color="primary"
        value={requestedUsername}
        onChange={handleUsernameInputChange}
        spellCheck={false}
        error={requestedUsernameError.length !== 0}
        helperText={requestedUsernameError}
      />
      <TextField
        placeholder="Room"
        color="primary"
        variant="outlined"
        value={requestedRoom}
        onChange={handleRoomInputChange}
        spellCheck={false}
        error={requestedRoomError.length !== 0}
        helperText={requestedRoomError}
      />
      <Button
        onClick={handleCreateRoomAttempt}
        disabled={textFieldsAreEmpty}
        variant="contained"
        color="primary"
        size="large"
      >
        Create Room
      </Button>
      <Button
        onClick={handleJoinRoomAttempt}
        disabled={textFieldsAreEmpty}
        variant="contained"
        color="secondary"
        size="large"
      >
        Join Room
      </Button>
    </Box>
  );
};

export default Login;
