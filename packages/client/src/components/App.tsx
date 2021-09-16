import React from 'react';
import {
  Box, CssBaseline, makeStyles, ThemeProvider,
} from '@material-ui/core';
import Chat from './Chat';
import Canvas from './Canvas';
import professional from '../themes/professional';

const useStyles = makeStyles((theme) => ({
  grid: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr 1fr',
    gap: '2rem',
  },
  canvas: {
    gridArea: '2 / 2 / 3 / 3',
    placeSelf: 'stretch',
    aspectRatio: '1',
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
  chat: {
    gridArea: '3 / 2 / 4 / 3',
    placeSelf: 'stretch',
    minHeight: '15rem',
    minWidth: '15rem',
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={professional}>
      <CssBaseline />
      <Box className={classes.grid}>
        <Canvas className={classes.canvas} />
        <Chat className={classes.chat} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
