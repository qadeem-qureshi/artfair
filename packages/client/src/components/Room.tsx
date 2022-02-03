import React, { useCallback, useEffect } from 'react';
import {
  Box, BoxProps, makeStyles, Paper, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import { Route, useHistory } from 'react-router-dom';
import { Artist } from '@artfair/common';
import socket from '../services/socket';
import GameTabs from './GameTabs';
import RoomName from './RoomName';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import Lobby from './Lobby';
import CanvasContextProvider from './CanvasContextProvider';
import { useAppContext } from './AppContextProvider';
import HostPromotionAlert from './HostPromotionAlert';
import KickAlert from './KickAlert';
import ActivityController from './ActivityController';

const CANVAS_RESOLUTION = 1024;
const MAIN_SIZE_LANDSCAPE = 'clamp(15rem, 50vw, 80vh)';
const SIDEBAR_SIZE_LANDSCAPE = '20rem';
const HEADER_SIZE_LANDSCAPE = '3rem';
const MAIN_SIZE_PORTRAIT = 'clamp(15rem, 85vw, 50vh)';
const SIDEBAR_SIZE_PORTRAIT = '15rem';
const HEADER_SIZE_PORTRAIT = '3rem';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: `${MAIN_SIZE_LANDSCAPE} ${SIDEBAR_SIZE_LANDSCAPE}`,
    gridTemplateRows: `${HEADER_SIZE_LANDSCAPE} ${MAIN_SIZE_LANDSCAPE}`,
    padding: '1.5rem',
    gap: '1.5rem',
  },
  header: {
    gridArea: '1 / 1 / 2 / 2',
  },
  main: {
    gridArea: '2 / 1 / 3 / 2',
  },
  sidebar: {
    gridArea: '2 / 2 / 3 / 3',
  },
  lobby: {
    padding: '1.5rem',
  },
});

const usePortraitOverrideStyles = makeStyles({
  root: {
    gridTemplateColumns: MAIN_SIZE_PORTRAIT,
    gridTemplateRows: `${HEADER_SIZE_PORTRAIT} ${MAIN_SIZE_PORTRAIT} ${SIDEBAR_SIZE_PORTRAIT}`,
  },
  sidebar: {
    gridArea: '3 / 1 / 4 / 2',
  },
});

export type RoomProps = BoxProps;

const Room: React.FC<RoomProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const portraitOverrideClasses = usePortraitOverrideStyles();
  const { state, dispatch } = useAppContext();
  const history = useHistory();
  const isPortrait = useMediaQuery('(max-aspect-ratio: 1/1)');
  const isCompact = useMediaQuery('(max-width: 60rem), (max-height: 40rem) and (min-aspect-ratio: 3/2)');
 
  const handleUserJoin = useCallback(
    (artist: Artist) => {
      dispatch({ type: 'user-join', artist });
    },
    [dispatch],
  );

  const handleUserLeave = useCallback(
    (username: string) => {
      dispatch({ type: 'user-leave', username });
    },
    [dispatch],
  );

  const handleEndGame = useCallback(() => {
    dispatch({ type: 'exit-activity' });
    history.push('/room/lobby');
  }, [dispatch, history]);

  useEffect(() => {
    socket.on('user_join', handleUserJoin);
    socket.on('user_leave', handleUserLeave);
    socket.on('end_game', handleEndGame);
    return () => {
      socket.off('user_join', handleUserJoin);
      socket.off('user_leave', handleUserLeave);
      socket.off('end_game', handleEndGame);
    };
  }, [handleEndGame, handleUserJoin, handleUserLeave]);

  // Redirect users who are not in a room
  useEffect(() => {
    if (!state.room.name) {
      history.push('/home');
    }
  }, [history, state.room.name]);
  
  // Exit the room when component unmounts
  useEffect(
    () => () => {
      socket.emit('user_leave');
      dispatch({ type: 'exit-room' });
    },
    [dispatch],
  );

  return (
    <Box className={clsx(classes.root, isPortrait && portraitOverrideClasses.root, className)} {...rest}>
      <Route path="/room/lobby">
        <RoomName className={classes.header} />
        <Lobby className={clsx(classes.main, classes.lobby)} component={Paper} />
      </Route>
      <Route path="/room/game">
        <ActivityController />
        <CanvasContextProvider>
          <Toolbar className={classes.header} compact={isPortrait || isCompact} />
          <Canvas className={classes.main} component={Paper} resolution={CANVAS_RESOLUTION} />
        </CanvasContextProvider>
      </Route>
      <GameTabs className={clsx(classes.sidebar, isPortrait && portraitOverrideClasses.sidebar)} component={Paper} />
      <HostPromotionAlert />
      <KickAlert />
    </Box>
  );
};

export default Room;
