import React, { useCallback, useEffect } from 'react';
import {
  Box, makeStyles, BoxProps,
  Typography,
  Divider,
} from '@material-ui/core';
import clsx from 'clsx';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    gap: '1rem',
  },
  player: {
    fontWeight: 'normal',
    margin: '1rem',
  },
  item: {
    flex: 1,
  },
}));

export type PlayersProps = BoxProps;

const Players: React.FC<PlayersProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useAppContext();

  const handleUserJoin = useCallback(
    (name: string) => {
      const players = state.players.concat(name);
      const { host } = state;
      dispatch({ type: 'set-players', players, host });
    },
    [dispatch],
  );

  const handleUserLeave = useCallback(
    (name: string) => {
      const players = state.players.filter((player) => player !== name);
      const { host } = state;

      dispatch({ type: 'set-players', players, host });
    },
    [dispatch],
  );

  useEffect(() => {
    socket.on('user_join', handleUserJoin);
    socket.on('user_leave', handleUserLeave);
  }, [handleUserJoin, handleUserLeave]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Typography
        align="center"
        variant="h6"
      >
        Players
      </Typography>
      <Divider />
      {state.players.map((player) => (
        <Box
          key={player}
          className={classes.item}
        >
          <Typography
            className={classes.player}
          >
            {player}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Players;
