import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import Home from './Home';
import Room from './Room';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'grid',
    placeItems: 'center',
  },
});

export type AppProps = BoxProps;

const App: React.FC<AppProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/room">
          <Room />
        </Route>
        <Route path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;
