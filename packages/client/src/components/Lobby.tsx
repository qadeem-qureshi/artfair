import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, makeStyles, BoxProps,
  useMediaQuery,
  Button,
} from '@material-ui/core';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import { GameType } from '@team-2/common';

import socket from '../services/socket';
import Chat from './Chat';
import Players from './Players';
import GameCard from './GameCard';
import { useAppContext } from './AppContextProvider';

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
  wrappedRoot:
  {
    flexDirection: 'column',
  },
  players: {
    height: MODE_SIZE,
    width: '15rem',
  },
  wrappedPlayers: {
    width: WRAPPED_MODE_SIZE,
    height: '15rem',
    alignSelf: 'auto',
  },
  gameMode: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: MODE_SIZE,
    height: MODE_SIZE,
    minHeight: MODE_SIZE,
    overflowY: 'auto',
    gap: '5px',
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
}));

const MODES = [
  { name: 'Game 1', gameType: GameType.Game1 },
  { name: 'Game 2', gameType: GameType.Game2 },
  { name: 'Game 3', gameType: GameType.Game3 },
  { name: 'Game 4', gameType: GameType.Game4 },
];

export type LobbyProps = BoxProps;

const Lobby: React.FC<LobbyProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');
  const history = useHistory();
  const { state } = useAppContext();
  const [gameMode, setGameMode] = useState(GameType.None);

  const handleGameSelection = (mode: GameType) => {
    setGameMode(mode);
  };

  const handleStartGame = () => {
    socket.emit('start_game', gameMode);
    history.push('/game');
  };

  const handleGameStarted = useCallback(() => {
    history.push('/game');
  }, [history]);

  useEffect(() => {
    socket.on('begin_game', handleGameStarted);
  }, [handleGameStarted]);

  return (
    <Box className={clsx(classes.root, shouldWrap && classes.wrappedRoot, className)} {...rest}>
      <Players className={clsx(classes.players, shouldWrap && classes.wrappedPlayers)} />
      <Box className={clsx(classes.gameMode, shouldWrap && classes.wrappedGameMode)}>
        {MODES.map((mode) => (
          <GameCard
            key={mode.name}
            name={mode.name}
            image="https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_640.png"
            disable={!state.host}
            onChildClick={() => handleGameSelection(mode.gameType)}
          />
        ))}
      </Box>
      <Box className={clsx(classes.root, classes.start)}>
        <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} />
        <Button
          onClick={handleStartGame}
          variant="contained"
          color="primary"
          size="large"
          disabled={!state.host || gameMode === GameType.None}
        >
          Start Game
        </Button>
      </Box>
    </Box>
  );
};

export default Lobby;
