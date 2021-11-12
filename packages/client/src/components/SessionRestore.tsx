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
} from '@material-ui/core';
import clsx from 'clsx';
import { RoomJoinData } from '@artfair/common';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

export type SessionProps = BoxProps;

const SessionRestore: React.FC<SessionProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  const history = useHistory();
  const { dispatch } = useAppContext();
  const [roomData, setRoomData] = useState<RoomJoinData>();
  const [roomFound, setRoomFound] = useState(false);
  const roomInfo = localStorage.getItem('roomInfo');

  const handleRejoinRoom = useCallback(
    () => {
      if (!roomData) return;
      dispatch({
        type: 'join-room',
        username: roomData.username,
        room: roomData.room,
        players: roomData.players,
      });
      history.push('/lobby');
    },
    [dispatch, history, roomData],
  );

  const handleRoomFound = useCallback(
    (data: RoomJoinData) => {
      setRoomData(data);
      setRoomFound(true);
    },
    [],
  );

  const handleRoomNotFoundError = useCallback(
    () => {
      setRoomFound(false);
      localStorage.removeItem('roomInfo');
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
    return () => {
      socket.off('retrieve-room-success', handleRoomFound);
      socket.off('retrieve-room-error', handleRoomNotFoundError);
    };
  }, [handleRoomFound, handleRoomNotFoundError]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Dialog
        open={roomFound}
        onClose={handleRoomNotFoundError}
      >
        <DialogTitle>
          Join last game?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to rejoin your last game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoomNotFoundError}>
            No
          </Button>
          <Button onClick={handleRejoinRoom} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionRestore;
