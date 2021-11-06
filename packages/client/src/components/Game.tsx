import React from 'react';
import {
  Box,
  BoxProps,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import Canvas from './Canvas';
import Chat from './Chat';
import Toolbar from './Toolbar';

const CANVAS_SIZE = 'min(50vw, 78vh)';
const WRAPPED_CANVAS_SIZE = 'min(80vw, 50vh)';
const CANVAS_RESOLUTION = 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  wrappedRoot: {
    flexDirection: 'column',
  },
  easel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  toolbar: {
    height: '2rem',
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  wrappedCanvas: {
    width: WRAPPED_CANVAS_SIZE,
    height: WRAPPED_CANVAS_SIZE,
  },
  chat: {
    height: CANVAS_SIZE,
    width: '20rem',
    padding: '1rem',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    alignSelf: 'flex-end',
  },
  wrappedChat: {
    width: WRAPPED_CANVAS_SIZE,
    height: '15rem',
    alignSelf: 'auto',
  },
}));

export type GameProps = BoxProps;

const Game: React.FC<GameProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');
  return (
    <Box
      className={clsx(
        classes.root,
        shouldWrap && classes.wrappedRoot,
        className,
      )}
      {...rest}
    >
      <Box className={classes.easel}>
        <Toolbar className={classes.toolbar} />
        <Canvas
          className={clsx(classes.canvas, shouldWrap && classes.wrappedCanvas)}
          width={CANVAS_RESOLUTION}
          height={CANVAS_RESOLUTION}
        />
      </Box>
      <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} />
    </Box>
  );
};

export default Game;
