import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  makeStyles,
  BoxProps,
  Dialog,
  DialogActions,
  Button,
  DialogContentText,
  DialogTitle,
  DialogContent,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import { PersistentUserData, RoomJoinData } from '@artfair/common';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {

  },
});

export type SessionProps = BoxProps;

const SessionRestore: React.FC<SessionProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  const history = useHistory();
  const { dispatch } = useAppContext();
  const [roomData, setRoomData] = useState<RoomJoinData>();
  const [userName, setUserName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [roomFound, setRoomFound] = useState(false);
  const roomInfo = sessionStorage.getItem('roomInfo');

  const handleUsernameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUsernameError('');
    setUserName(event.target.value.trimLeft());
  };

  const handleTakenUsername = useCallback(() => {
    setUsernameError('This username is taken.');
  }, []);

  const handleNonexistentRoom = useCallback(() => {
    setRoomFound(false);
    sessionStorage.removeItem('roomInfo');
  }, []);

  const handleRejoinRoomAttempt = () => {
    socket.emit('join_room_attempt', {
      username: userName,
      room: roomData?.room,
    });
  };

  const handleRejoinRoom = useCallback(
    (data: RoomJoinData) => {
      dispatch({
        type: 'join-room',
        username: data.username,
        room: data.room,
        players: data.players,
      });

      const newRoomInfo: PersistentUserData = { username: data.username, uid: data.uid };
      sessionStorage.setItem('roomInfo', JSON.stringify(newRoomInfo));

      history.push('/lobby');
    },
    [dispatch, history],
  );

  const handleRoomFound = useCallback(
    (data: RoomJoinData) => {
      setRoomData(data);
      setUserName(data.username);
      setRoomFound(true);
    },
    [],
  );

  const handleRoomNotFoundError = useCallback(
    () => {
      setRoomFound(false);
      sessionStorage.removeItem('roomInfo');
    },
    [],
  );

  useEffect(() => {
    if (!roomInfo) return;
    socket.emit('retrieve-room-attempt', JSON.parse(roomInfo));
  },
  [roomInfo]);

  useEffect(() => {
    socket.on('retrieve-room-success', handleRoomFound);
    socket.on('retrieve-room-error', handleRoomNotFoundError);
    socket.on('username_taken', handleTakenUsername);
    socket.on('room_joined', handleRejoinRoom);
    socket.on('room_does_not_exist', handleNonexistentRoom);

    return () => {
      socket.off('retrieve-room-success', handleRoomFound);
      socket.off('retrieve-room-error', handleRoomNotFoundError);
      socket.off('username_taken', handleTakenUsername);
      socket.on('room_joined', handleRejoinRoom);
      socket.off('room_does_not_exist', handleNonexistentRoom);
    };
  }, [handleRoomFound, handleRoomNotFoundError, handleTakenUsername, handleRejoinRoom, handleNonexistentRoom]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Dialog
        open={roomFound}
        className={classes.root}
        onClose={handleRoomNotFoundError}
      >
        <DialogTitle>
          Join last game?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to rejoin your last game?
          </DialogContentText>
          <TextField
            label="Username"
            variant="outlined"
            color="primary"
            value={userName}
            onChange={handleUsernameInputChange}
            spellCheck={false}
            error={usernameError.length !== 0}
            helperText={usernameError}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoomNotFoundError}>
            No
          </Button>
          <Button onClick={handleRejoinRoomAttempt} variant="contained" color="primary" disabled={userName.length === 0}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionRestore;
