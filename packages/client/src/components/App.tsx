import React from 'react';
import {
  Box, CssBaseline, makeStyles, ThemeProvider, useMediaQuery,
} from '@material-ui/core';
import {
  BrowserRouter, Switch, Route,
} from 'react-router-dom';
import clsx from 'clsx';
import Chat from './Chat';
import Canvas from './Canvas';
import Home from './Home';
import professional from '../themes/professional';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '2rem',
    height: '100vh',
    minHeight: '20rem',
    minWidth: '10rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
  },
  wrappedContent: {
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

const App: React.FC = () => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 3/2)');
  return (
    <ThemeProvider theme={professional}>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home className={classes.content} />
          </Route>
          <Route path="/room/:id">
            <Box className={clsx(classes.content, shouldWrap && classes.wrappedContent)}>
              <Canvas width={1000} height={1000} className={classes.canvas} />
              <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} />
            </Box>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
