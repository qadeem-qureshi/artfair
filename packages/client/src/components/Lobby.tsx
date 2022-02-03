import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { Activity } from '@artfair/common';
import socket from '../services/socket';
import ActivityCarousel from './ActivityCarousel';
import { useAppContext } from './AppContextProvider';

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
  const { state, dispatch } = useAppContext();
  const [currentActivity, setCurrentActivity] = useState<Activity>(
    state.room.activity,
  );

  const handleActivityChange = useCallback((activity: Activity) => {
    setCurrentActivity(activity);
  }, []);

  const handlePlay = () => {
    dispatch({ type: 'set-activity', activity: currentActivity });
    dispatch({ type: 'set-gamestate', gamestate: 'in-game' });
    socket.emit('start_game', currentActivity);
    history.push('/room/game');
  };

  const startGame = useCallback(
    (activity: Activity) => {
      dispatch({ type: 'set-activity', activity });
      dispatch({ type: 'set-gamestate', gamestate: 'in-game' });
      history.push('/room/game');
    },
    [dispatch, history],
  );

  useEffect(() => {
    socket.on('start_game', startGame);
    return () => {
      socket.off('start_game', startGame);
    };
  }, [startGame]);

  useEffect(() => {
    // Redirect users who are not in a room
    if (state.room.gamestate === 'in-game') {
      if (state.room.hostname === state.artist.name) {
        socket.emit('end_game');
      }
    }
  }, [history, state.artist.name, state.room.gamestate, state.room.hostname]);

  const isHost = state.room.hostname === state.artist.name;
  const inSession = state.room.gamestate === 'in-game';

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <ActivityCarousel
        className={classes.carousel}
        onActivityChange={handleActivityChange}
      />
      {isHost ? (
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={handlePlay}
        >
          Start Activity
        </Button>
      ) : (
        <Typography
          className={classes.waitingText}
          variant="subtitle1"
          color="textSecondary"
        >
          {inSession ? (
            <>Waiting for the activity to finish.</>
          ) : (
            <>Waiting for the host to start an activity.</>
          )}
        </Typography>
      )}
    </Box>
  );
};

export default Lobby;
