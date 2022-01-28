import React, { useEffect } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import { Switch, Route, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import Home from './Home';
import Room from './Room';
import { useRoomContext } from './RoomContextProvider';

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
  const { state } = useRoomContext();
  const history = useHistory();

  useEffect(() => {
    // Redirect users who are not in a room
    if (!state.userData.roomname) {
      history.push('/home');
    }
  }, [history, state.userData.roomname]);

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
