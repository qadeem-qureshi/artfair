import React, { useCallback, useEffect } from 'react';
import {
  Box, BoxProps, Button, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import socket from '../services/socket';
import { useRoomContext } from './RoomContextProvider';
import ActivityCarousel from './ActivityCarousel';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    overflow: 'auto',
  },
  carousel: {
    flex: 1,
    minHeight: 0,
  },
  waitingText: {
    fontStyle: 'italic',
  },
});

export type LobbyProps = BoxProps;

const Lobby: React.FC<LobbyProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useRoomContext();

  const handlePlay = () => {
    socket.emit('start_game');
    history.push('/room/game');
  };

  const startGame = useCallback(() => {
    history.push('/room/game');
  }, [history]);

  useEffect(() => {
    socket.on('start_game', startGame);
    return () => {
      socket.off('start_game', startGame);
    };
  }, [startGame]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <ActivityCarousel className={classes.carousel} />
      {state.isHost ? (
        <Button fullWidth color="primary" variant="contained" onClick={handlePlay}>
          Start Activity
        </Button>
      ) : (
        <Typography className={classes.waitingText} variant="subtitle1" color="textSecondary">
          Waiting for the host to start an activity.
        </Typography>
      )}
    </Box>
  );
};

export default Lobby;
