import React, { useCallback, useEffect, useState } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import { Switch, Route, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Artist } from '@artfair/common';
import Home from './Home';
import Game from './Game';
import Lobby from './Lobby';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';
import BackgroundImage from '../assets/snowflakes.jpg';
import ConfirmationDialog from './ConfirmationDialog';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '100rem',
  },
});

export type AppProps = BoxProps;

const App: React.FC<AppProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const { state, dispatch } = useAppContext();
  const [hostAlertIsOpen, setHostAlertIsOpen] = useState(false);

  const closeHostAlert = () => {
    setHostAlertIsOpen(false);
  };

  const openHostAlert = () => {
    setHostAlertIsOpen(true);
  };

  const handleUserJoin = useCallback(
    (artist: Artist) => {
      dispatch({ type: 'user-join', artist });
    },
    [dispatch],
  );

  const handleUserLeave = useCallback(
    (username: string) => {
      dispatch({ type: 'user-leave', username });
    },
    [dispatch],
  );

  const handleHostPromotion = useCallback(
    (hostname: string) => {
      dispatch({ type: 'set-host', hostname });
      openHostAlert();
    },
    [dispatch],
  );

  useEffect(() => {
    socket.on('user_join', handleUserJoin);
    socket.on('user_leave', handleUserLeave);
    socket.on('promote_host', handleHostPromotion);

    return () => {
      socket.off('user_join', handleUserJoin);
      socket.off('user_leave', handleUserLeave);
      socket.off('promote_host', handleHostPromotion);
    };
  }, [handleHostPromotion, handleUserJoin, handleUserLeave]);

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
        <Route path="/lobby">
          <Lobby />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Switch>
      <ConfirmationDialog
        open={hostAlertIsOpen}
        onCancel={closeHostAlert}
        onConfirm={closeHostAlert}
        onClose={closeHostAlert}
        title="You have been promoted to room host!"
        message="As host, you have the ability to control activities, kick out malicious artists, or transfer your power to another artist."
        confirmText="Ok"
      />
    </Box>
  );
};

export default App;
