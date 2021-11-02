import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, makeStyles, BoxProps,
  useMediaQuery,
  Button,
  Typography,
  Divider,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import Chat from './Chat';
import socket from '../services/socket';

const MODE_SIZE = 'min(50vw, 78vh)';
const WRAPPED_MODE_SIZE = 'min(80vw, 50vh)';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '1rem',
  },
  players: {
    height: MODE_SIZE,
    width: '15rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    gap: '1rem',
  },
  gameMode: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '5px',
    width: MODE_SIZE,
    height: MODE_SIZE,
    minHeight: MODE_SIZE,
    overflowY: 'auto',
  },
  wrappedGameMode: {
    width: WRAPPED_MODE_SIZE,
    height: WRAPPED_MODE_SIZE,
  },
  start: {
    flexDirection: 'column',
    maxHeight: MODE_SIZE,
  },
  chat: {
    height: MODE_SIZE,
    width: '20rem',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    alignSelf: 'flex-start',
  },
  wrappedChat: {
    width: WRAPPED_MODE_SIZE,
    height: '15rem',
    alignSelf: 'auto',
  },
  player: {
    fontWeight: 'normal',
    margin: '1rem',
  },
  item: {
    flex: 1,
  },
  gameCard:
  {
    width: '49%',
    height: '49%',
  },
}));

const MODES = [
  'ConArtist',
  'Game 2',
  'Game 3',
  'Game 4',
];

export type LobbyProps = BoxProps;

const Lobby: React.FC<LobbyProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');
  const history = useHistory();
  const [players, setPlayers] = useState<string[]>([]);

  const handleStartGame = () => {
    history.push('/game');
  };

  const handleUserJoin = useCallback(
    (name: string) => {
      setPlayers((oldPlayers) => [...oldPlayers, name]);
    },
    [],
  );

  const handleUserLeave = useCallback(
    (name: string) => {
      setPlayers((oldPlayers) => oldPlayers.filter((player) => player !== name));
    },
    [setPlayers],
  );

  const handlePlayers = useCallback(
    (data: string[]) => {
      setPlayers([...data]);
    },
    [setPlayers],
  );

  useEffect(() => {
    socket.on('user_join', handleUserJoin);
    socket.on('user_leave', handleUserLeave);
    socket.on('receive_players', handlePlayers);
    socket.emit('request_players');
  }, [handleUserJoin, handleUserLeave, handlePlayers]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={clsx(classes.players)}>
        <Typography
          align="center"
          variant="h6"
        >
          Players
        </Typography>
        <Divider />
        {players.map((player) => (
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
      <Box className={clsx(classes.root, classes.gameMode)}>
        {MODES.map((mode) => (
          <Card className={classes.gameCard}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="100%"
                width="100%"
                image="https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_640.png"
                alt={mode}
              />
              <CardContent>
                <Typography align="center" variant="h5" component="div">
                  {mode}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Box className={clsx(classes.root, classes.start)}>
        <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} />
        <Button
          onClick={handleStartGame}
          variant="contained"
          color="primary"
          size="large"
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
};

export default Lobby;
