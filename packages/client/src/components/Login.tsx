import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, BoxProps, Button, makeStyles, TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import { RoomCreationData, RoomJoinData, UserData } from '@artfair/common';
import { useHistory } from 'react-router-dom';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';
import AvatarSelector from './AvatarSelector';

const saveSessionInfo = (userData: UserData) => sessionStorage.setItem('userData', JSON.stringify(userData));
const getSessionInfo = () => {
  const serializedData = sessionStorage.getItem('userData');
  return serializedData ? JSON.parse(serializedData) as UserData : null;
};

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
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [requestedUsername, setRequestedUsername] = useState('');
  const [requestedRoomname, setRequestedRoomname] = useState('');
  const [requestedUsernameError, setRequestedUsernameError] = useState('');
  const [requestedRoomnameError, setRequestedRoomnameError] = useState('');
  const history = useHistory();
  const { dispatch } = useAppContext();

  useEffect(() => {
    const sessionUserData: UserData | null = getSessionInfo();
    if (!sessionUserData) return;
    setSelectedAvatarIndex(sessionUserData.avatarIndex);
    setRequestedUsername(sessionUserData.name);
    setRequestedRoomname(sessionUserData.roomname);
  }, []);

  const handleAvatarIndexChange = (index: number) => {
    setSelectedAvatarIndex(index);
  };

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedUsernameError('');
    setRequestedUsername(event.target.value.trimLeft());
  };

  const handleRoomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedRoomnameError('');
    setRequestedRoomname(event.target.value.trimLeft());
  };

  const handleCreateRoomAttempt = () => {
    const userData: UserData = {
      name: requestedUsername,
      roomname: requestedRoomname,
      avatarIndex: selectedAvatarIndex,
    };
    socket.emit('create_room_attempt', userData);
  };

  const handleJoinRoomAttempt = () => {
    const userData: UserData = {
      name: requestedUsername,
      roomname: requestedRoomname,
      avatarIndex: selectedAvatarIndex,
    };
    socket.emit('join_room_attempt', userData);
  };

  const handleTakenRoomname = useCallback(() => {
    setRequestedRoomnameError('This room already exists.');
  }, []);

  const handleNonexistentRoom = useCallback(() => {
    setRequestedRoomnameError('This room does not exist.');
  }, []);

  const handleTakenUsername = useCallback(() => {
    setRequestedUsernameError('This username is taken.');
  }, []);

  const handleRoomCreated = useCallback(
    (data: RoomCreationData) => {
      const userData: UserData = {
        name: data.username,
        roomname: data.roomname,
        avatarIndex: selectedAvatarIndex,
      };
      dispatch({
        type: 'create-room',
        userData,
      });
      saveSessionInfo(userData);
      history.push('/lobby');
    },
    [dispatch, history, selectedAvatarIndex],
  );

  const handleRoomJoined = useCallback(
    (data: RoomJoinData) => {
      const userData: UserData = {
        name: data.username,
        roomname: data.roomname,
        avatarIndex: selectedAvatarIndex,
      };
      dispatch({
        type: 'join-room',
        roomMembers: data.roomMembers,
        userData,
      });
      saveSessionInfo(userData);
      history.push('/lobby');
    },
    [dispatch, history, selectedAvatarIndex],
  );

  useEffect(() => {
    socket.on('room_taken', handleTakenRoomname);
    socket.on('room_does_not_exist', handleNonexistentRoom);
    socket.on('username_taken', handleTakenUsername);
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);

    return () => {
      socket.off('room_taken', handleTakenRoomname);
      socket.off('room_does_not_exist', handleNonexistentRoom);
      socket.off('username_taken', handleTakenUsername);
      socket.off('room_created', handleRoomCreated);
      socket.off('room_joined', handleRoomJoined);
    };
  }, [
    handleTakenRoomname,
    handleNonexistentRoom,
    handleTakenUsername,
    handleRoomCreated,
    handleRoomJoined,
  ]);

  const textFieldsAreEmpty = requestedUsername.length === 0 || requestedRoomname.length === 0;

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <AvatarSelector avatarIndex={selectedAvatarIndex} onAvatarSelect={handleAvatarIndexChange} />
      <TextField
        placeholder="Name"
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
        value={requestedRoomname}
        onChange={handleRoomInputChange}
        spellCheck={false}
        error={requestedRoomnameError.length !== 0}
        helperText={requestedRoomnameError}
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
