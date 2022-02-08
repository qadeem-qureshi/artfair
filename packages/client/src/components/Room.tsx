import React, { useCallback, useEffect } from 'react';
import {
  Box, BoxProps, makeStyles, Paper, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import { Artist } from '@artfair/common';
import socket from '../services/socket';
import RoomName from './RoomName';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import Lobby from './Lobby';
import CanvasContextProvider from './CanvasContextProvider';
import { useRoomContext } from './RoomContextProvider';
import HostPromotionAlert from './HostPromotionAlert';
import KickAlert from './KickAlert';
import RoomTabs from './RoomTabs';

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
  const isPortrait = useMediaQuery('(max-aspect-ratio: 1/1)');
  const isCompact = useMediaQuery('(max-width: 60rem), (max-height: 40rem) and (min-aspect-ratio: 3/2)');
  const { state, dispatch } = useRoomContext();

  const handleArtistJoin = useCallback(
    (artist: Artist) => {
      dispatch({ type: 'artist-join', artist });
    },
    [dispatch],
  );

  const handleArtistLeave = useCallback(
    (username: string) => {
      dispatch({ type: 'artist-leave', username });
    },
    [dispatch],
  );

  const handleEndActivity = useCallback(() => {
    dispatch({ type: 'exit-activity' });
  }, [dispatch]);

  useEffect(() => {
    socket.on('artist_join', handleArtistJoin);
    socket.on('artist_leave', handleArtistLeave);
    socket.on('end_activity', handleEndActivity);
    return () => {
      socket.off('artist_join', handleArtistJoin);
      socket.off('artist_leave', handleArtistLeave);
      socket.off('end_activity', handleEndActivity);
    };
  }, [handleEndActivity, handleArtistJoin, handleArtistLeave]);

  return (
    <Box className={clsx(classes.root, isPortrait && portraitOverrideClasses.root, className)} {...rest}>
      {state.artist.isPartOfActivity ? (
        <CanvasContextProvider>
          <Toolbar className={classes.header} compact={isPortrait || isCompact} />
          <Canvas className={classes.main} component={Paper} resolution={CANVAS_RESOLUTION} />
        </CanvasContextProvider>
      ) : (
        <>
          <RoomName className={classes.header} />
          <Lobby className={clsx(classes.main, classes.lobby)} component={Paper} />
        </>
      )}
      <RoomTabs className={clsx(classes.sidebar, isPortrait && portraitOverrideClasses.sidebar)} component={Paper} />
      <HostPromotionAlert />
      <KickAlert />
    </Box>
  );
};

export default Room;
