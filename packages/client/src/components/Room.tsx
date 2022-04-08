import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  BoxProps,
  makeStyles,
  Paper,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import { Activity, Artist } from '@artfair/common';
import socket from '../services/socket';
import RoomName from './RoomName';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import CanvasContextProvider from './CanvasContextProvider';
import { useRoomContext } from './RoomContextProvider';
import HostPromotionAlert from './HostPromotionAlert';
import KickAlert from './KickAlert';
import RoomTabs from './RoomTabs';
import DiscussionPanel from './DiscussionPanel';
import ExitRoomButton from './ExitRoomButton';
import StartActivityButton from './StartActivityButton';
import ActivityCarousel from './ActivityCarousel';
import StartDiscussionButton from './StartDiscussionButton';
import EndDiscussionButton from './EndDiscussionButton';
import ActivityPrompt from './ActivityPrompt';

const CANVAS_RESOLUTION = 1024;
const MAIN_SIZE_LANDSCAPE = 'clamp(15rem, 50vw, 80vh)';
const SIDEBAR_SIZE_LANDSCAPE = '20rem';
const HEADER_SIZE_LANDSCAPE = '3rem';
const MAIN_SIZE_PORTRAIT = 'clamp(15rem, 85vw, 50vh)';
const SIDEBAR_SIZE_PORTRAIT = '12rem';
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
  stageContent: {
    padding: '1.5rem',
  },
  stageButton: {
    alignSelf: 'center',
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
  const isCompact = useMediaQuery(
    '(max-width: 60rem), (max-height: 40rem) and (min-aspect-ratio: 3/2)',
  );
  const { state, dispatch } = useRoomContext();
  const isHost = state.artist.name === state.room.hostname;

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

  const handleStartActivity = useCallback(
    (activity: Activity, prompt?: string) => {
      dispatch({ type: 'start-activity', activity, prompt });
    },
    [dispatch],
  );
  const handleStartDiscussion = useCallback(() => {
    dispatch({ type: 'start-discussion' });
  }, [dispatch]);

  const handleEndDiscussion = useCallback(() => {
    dispatch({ type: 'end-discussion' });
  }, [dispatch]);

  useEffect(() => {
    socket.on('artist_join', handleArtistJoin);
    socket.on('artist_leave', handleArtistLeave);
    socket.on('start_activity', handleStartActivity);
    socket.on('start_discussion', handleStartDiscussion);
    socket.on('end_discussion', handleEndDiscussion);
    return () => {
      socket.off('artist_join', handleArtistJoin);
      socket.off('artist_leave', handleArtistLeave);
      socket.off('start_activity', handleStartActivity);
      socket.off('start_discussion', handleStartDiscussion);
      socket.on('end_discussion', handleEndDiscussion);
    };
  }, [
    handleArtistJoin,
    handleArtistLeave,
    handleStartDiscussion,
    handleStartActivity,
    handleEndDiscussion,
  ]);

  const stageContent = useMemo(() => {
    switch (state.artist.stage) {
      case 'lobby':
        return (
          <>
            <RoomName className={classes.header} />
            <ActivityCarousel
              className={clsx(classes.main, classes.stageContent)}
              component={Paper}
            />
          </>
        );
      case 'activity':
        return (
          <>
            <ActivityPrompt />
            <CanvasContextProvider>
              <Toolbar
                className={classes.header}
                compact={isPortrait || isCompact}
              />
              <Canvas
                className={classes.main}
                component={Paper}
                resolution={CANVAS_RESOLUTION}
              />
            </CanvasContextProvider>
          </>
        );
      case 'discussion':
        return (
          <>
            <RoomName className={classes.header} />
            <DiscussionPanel
              className={clsx(classes.main, classes.stageContent)}
              component={Paper}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    state.artist.stage,
    classes.header,
    classes.main,
    classes.stageContent,
    isPortrait,
    isCompact,
  ]);

  const stageButton = useMemo(() => {
    if (isHost) {
      switch (state.artist.stage) {
        case 'lobby':
          return <StartActivityButton className={classes.stageButton} />;
        case 'activity':
          return <StartDiscussionButton className={classes.stageButton} />;
        case 'discussion':
          return <EndDiscussionButton className={classes.stageButton} />;
        default:
          return null;
      }
    } else {
      return <ExitRoomButton className={classes.stageButton} />;
    }
  }, [classes.stageButton, isHost, state.artist.stage]);

  return (
    <Box
      className={clsx(
        classes.root,
        isPortrait && portraitOverrideClasses.root,
        className,
      )}
      {...rest}
    >
      {stageContent}
      {stageButton}
      <RoomTabs
        className={clsx(
          classes.sidebar,
          isPortrait && portraitOverrideClasses.sidebar,
        )}
        component={Paper}
      />
      <HostPromotionAlert />
      <KickAlert />
    </Box>
  );
};

export default Room;
