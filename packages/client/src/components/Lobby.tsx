import React from 'react';
import {
  Box,
  BoxProps,
  Button,
  makeStyles,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import Chat from './Chat';
import { useAppContext } from './AppContextProvider';
import ArtistCard from './ArtistCard';
import ActivityCard from './ActivityCard';

const MAIN_SIZE = 'min(50vw, 78vh)';
const WRAPPED_MAIN_SIZE = 'min(80vw, 50vh)';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '1rem',
  },
  panelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '1rem',
  },
  wrappedPanelContainer: {
    flexDirection: 'column',
  },
  room: {
    textAlign: 'center',
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
  artistPanel: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
  },
  activitiesPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    padding: '1rem',
    gap: '1rem',
    flex: 1,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  chat: {
    height: MAIN_SIZE,
    width: '20rem',
    padding: '1rem',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  wrappedChat: {
    width: WRAPPED_MAIN_SIZE,
    height: '15rem',
  },
  activityCard: {
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  activityCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '1rem',
    flex: 1,
  },
  playButton: {},
}));

export type LobbyProps = BoxProps;

const Lobby: React.FC<LobbyProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Typography className={classes.room} variant="h2">
        {state.room}
      </Typography>
      <Box
        className={clsx(
          classes.panelContainer,
          shouldWrap && classes.wrappedPanelContainer,
        )}
      >
        <Box className={clsx(classes.main, shouldWrap && classes.wrappedMain)}>
          <Box className={classes.artistPanel}>
            {state.players.map((player) => (
              <ArtistCard name={player} />
            ))}
          </Box>
          <Box className={classes.activitiesPanel}>
            <Box className={classes.activityCardContainer}>
              <ActivityCard
                className={classes.activityCard}
                name="Art Collab"
                description="Draw some stuff"
              />
              <ActivityCard
                className={classes.activityCard}
                name="Con Artist"
                description="Draw some more stuff"
              />
              <ActivityCard
                className={classes.activityCard}
                name="Canvas Swap"
                description="Draw even more stuff"
              />
            </Box>
            {state.isHost && (
              <Button color="primary" variant="contained">
                Play
              </Button>
            )}
          </Box>
        </Box>
        <Chat
          className={clsx(classes.chat, shouldWrap && classes.wrappedChat)}
        />
      </Box>
    </Box>
  );
};

export default Lobby;
