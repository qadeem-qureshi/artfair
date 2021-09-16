import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Chat from './Chat';
import Canvas from './Canvas';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    padding: '1rem',
    maxWidth: '80vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chat: {
    margin: '1rem',
    border: '1px solid black',
    flexGrow: 1,
  },
  canvas: {
    margin: '1rem',
    width: 'min(70vw, 80vh)',
    aspectRatio: '1',
    border: '1px solid black',
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <Canvas className={classes.canvas} />
        <Chat className={classes.chat} />
      </Box>
    </Box>
  );
};

export default App;
