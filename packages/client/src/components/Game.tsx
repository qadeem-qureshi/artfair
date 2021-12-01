import React from 'react';
import {
  Box, BoxProps, makeStyles, Paper, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import ChatRounded from '@material-ui/icons/ChatRounded';
import GroupRounded from '@material-ui/icons/GroupRounded';
import InfoRounded from '@material-ui/icons/InfoRounded';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import GameTabs, { TabItem } from './GameTabs';
import Chat from './Chat';
import Rules from './Rules';
import Artists from './Artists';

const CANVAS_SIZE = 'min(50vw, 78vh)';
const WRAPPED_CANVAS_SIZE = 'min(80vw, 50vh)';
const CANVAS_RESOLUTION = 1000;

const TAB_ITEMS: TabItem[] = [
  { label: 'Chat', icon: ChatRounded, content: Chat },
  { label: 'Artists', icon: GroupRounded, content: Artists },
  { label: 'Rules', icon: InfoRounded, content: Rules },
];

const useStyles = makeStyles({
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
    userSelect: 'none',
  },
  canvasContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    overflow: 'hidden',
  },
  wrappedCanvasContainer: {
    width: WRAPPED_CANVAS_SIZE,
    height: WRAPPED_CANVAS_SIZE,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  gameTabs: {
    height: CANVAS_SIZE,
    width: '20rem',
    alignSelf: 'flex-end',
  },
  wrappedGameTabs: {
    width: WRAPPED_CANVAS_SIZE,
    height: '15rem',
    alignSelf: 'auto',
  },
});

export type GameProps = BoxProps;

const Game: React.FC<GameProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');
  return (
    <Box className={clsx(classes.root, shouldWrap && classes.wrappedRoot, className)} {...rest}>
      <Box className={classes.easel}>
        <Toolbar />
        <Paper className={clsx(classes.canvasContainer, shouldWrap && classes.wrappedCanvasContainer)}>
          <Canvas className={classes.canvas} width={CANVAS_RESOLUTION} height={CANVAS_RESOLUTION} />
        </Paper>
      </Box>
      <GameTabs
        className={clsx(classes.gameTabs, shouldWrap && classes.wrappedGameTabs)}
        component={Paper}
        items={TAB_ITEMS}
      />
    </Box>
  );
};

export default Game;
