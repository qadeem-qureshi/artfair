import React from 'react';
import {
  Box, CssBaseline, makeStyles, ThemeProvider,
} from '@material-ui/core';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Home from './Home';
import professional from '../themes/professional';
import Game from './Game';
import UserContextProvider from './AppContextProvider';

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
      <UserContextProvider>
        <HashRouter>
          <Box className={classes.content}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/game">
                <Game />
              </Route>
            </Switch>
          </Box>
        </HashRouter>
      </UserContextProvider>
    </ThemeProvider>
  );
};

export default App;
