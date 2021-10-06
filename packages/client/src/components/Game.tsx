import React from 'react';
import {
  Box, BoxProps, makeStyles, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import Canvas from './Canvas';
import Chat from './Chat';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '20rem',
    minWidth: '10rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
  },
  wrappedRoot: {
    flexDirection: 'column',
  },
  canvas: {
    height: 'min(70vw, 60vh)',
    width: 'min(70vw, 60vh)',
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
  chat: {
    height: 'min(70vw, 60vh)',
    width: '20rem',
    minHeight: '10rem',
    minWidth: '20rem',
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
  wrappedChat: {
    width: 'min(70vw, 60vh)',
    height: '15rem',
  },
}));

export type GameProps = BoxProps;

const Game: React.FC<GameProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 3/2)');
  return (
    <Box className={clsx(classes.root, shouldWrap && classes.wrappedRoot, className)} {...rest}>
      <Canvas width={1000} height={1000} className={classes.canvas} />
      <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} />
    </Box>
  );
};

export default Game;
