import React from 'react';
import {
  Box, BoxProps, makeStyles, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import Canvas from './Canvas';
import Chat from './Chat';
import ColorPalette from './ColorPalette';
import StrokeSize from './StrokeSize';

const CANVAS_SIZE = 'min(70vw, 55vh)';
const PALETTE_SIZE = `calc(0.05 * ${CANVAS_SIZE})`;
const CANVAS_CONTAINER_SIZE = `calc(${CANVAS_SIZE} + ${PALETTE_SIZE})`;
const CANVAS_RESOLUTION = 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
  },
  wrappedRoot: {
    flexDirection: 'column',
  },
  colorPalette: {
    height: PALETTE_SIZE,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  strokeSize: {
    height: '3rem',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  canvasContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
  chat: {
    height: CANVAS_CONTAINER_SIZE,
    width: '20rem',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  wrappedChat: {
    width: CANVAS_SIZE,
    height: '15rem',
  },
}));

export type GameProps = BoxProps;

const Game: React.FC<GameProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 3/2)');
  return (
    <Box
      className={clsx(
        classes.root,
        shouldWrap && classes.wrappedRoot,
        className,
      )}
      {...rest}
    >
      <Box className={classes.canvasContainer}>
        <ColorPalette className={classes.colorPalette} />
        <StrokeSize className={classes.strokeSize} />
        <Canvas
          className={classes.canvas}
          width={CANVAS_RESOLUTION}
          height={CANVAS_RESOLUTION}
        />
      </Box>
      <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} />
    </Box>
  );
};

export default Game;
