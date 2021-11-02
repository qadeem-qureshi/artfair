import React from 'react';
import {
  Box, CssBaseline, makeStyles, ThemeProvider,
} from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import professional from '../themes/professional';
import Game from './Game';
import AppContextProvider from './AppContextProvider';
import Lobby from './Lobby';

const useStyles = makeStyles({
  content: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={professional}>
      <CssBaseline />
      <AppContextProvider>
        <BrowserRouter>
          <Box className={classes.content}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/lobby/">
                <Lobby />
              </Route>
              <Route path="/game">
                <Game />
              </Route>
            </Switch>
          </Box>
        </BrowserRouter>
      </AppContextProvider>
    </ThemeProvider>
  );
};

export default App;
