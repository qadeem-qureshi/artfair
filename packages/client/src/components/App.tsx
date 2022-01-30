import React, { useEffect } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import { Switch, Route, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import Home from './Home';
import Room from './Room';
import { useAppContext } from './AppContextProvider';

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
  const history = useHistory();
  const { state } = useAppContext();

  useEffect(() => {
    // Redirect users who are not in a room
    if (!state.room.name) {
      history.push('/home');
    }
  }, [history, state.room.name]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/room">
          <Room />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;
