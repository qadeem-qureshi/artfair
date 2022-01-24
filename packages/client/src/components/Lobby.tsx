import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, BoxProps, Button, makeStyles, Paper, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { Activity } from '@artfair/common';
import socket from '../services/socket';
import Chat from './Chat';
import HorizontalArtistList from './HorizontalArtistList';
import RoomName from './RoomName';
import ActivityCarousel from './ActivityCarousel';
import { useAppContext } from './AppContextProvider';

const MAIN_SIZE = 'min(50vw, 78vh)';
const WRAPPED_MAIN_SIZE = 'min(80vw, 50vh)';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  roomName: {
    maxWidth: '80vw',
    alignSelf: 'flex-start',
  },
  panelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '1rem',
  },
  wrappedPanelContainer: {
    flexDirection: 'column',
  },
  main: {
    height: MAIN_SIZE,
    width: MAIN_SIZE,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  wrappedMain: {
    height: WRAPPED_MAIN_SIZE,
    width: WRAPPED_MAIN_SIZE,
  },
  artistList: {
    padding: '1rem',
    overflowX: 'auto',
  },
  chat: {
    height: MAIN_SIZE,
    width: '20rem',
    padding: '1rem',
  },
  wrappedChat: {
    width: WRAPPED_MAIN_SIZE,
    height: '15rem',
  },
  activityContentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1rem',
    gap: '1rem',
    overflow: 'auto',
  },
  activityCarousel: {
    flex: 1,
    minHeight: 0,
  },
});

export type LobbyProps = BoxProps;

const Lobby: React.FC<LobbyProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');
  const history = useHistory();
  const { state, dispatch } = useAppContext();
  const [currentActivity, setCurrentActivity] = useState<Activity>(state.room.activity);

  const handleActivityChange = useCallback((activity: Activity) => {
    setCurrentActivity(activity);
  }, []);

  const handlePlay = () => {
    dispatch({ type: 'set-activity', activity: currentActivity });
    socket.emit('start_game', currentActivity);
    history.push('/game');
  };

  const startGame = useCallback((activity: Activity) => {
    dispatch({ type: 'set-activity', activity });
    history.push('/game');
  }, [dispatch, history]);

  useEffect(() => {
    socket.on('start_game', startGame);

    return () => {
      socket.off('start_game', startGame);
    };
  }, [startGame]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.content}>
        <RoomName className={classes.roomName} />
        <Box className={clsx(classes.panelContainer, shouldWrap && classes.wrappedPanelContainer)}>
          <Box className={clsx(classes.main, shouldWrap && classes.wrappedMain)}>
            <HorizontalArtistList className={classes.artistList} component={Paper} />
            <Paper className={classes.activityContentContainer}>
              <ActivityCarousel className={classes.activityCarousel} onActivityChange={handleActivityChange} />
              {state.room.hostname === state.artist.name && (
                <Button color="primary" variant="contained" onClick={handlePlay}>
                  Play
                </Button>
              )}
            </Paper>
          </Box>
          <Chat
            className={clsx(classes.chat, shouldWrap && classes.wrappedChat)}
            component={Paper}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Lobby;
