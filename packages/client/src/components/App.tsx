import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Home from './Home';
import Room from './Room';
import RoomContextProvider from './RoomContextProvider';
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
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.joinRoomData ? (
        <RoomContextProvider defaultRoomState={state.joinRoomData}>
          <Room />
        </RoomContextProvider>
      ) : (
        <Home />
      )}
    </Box>
  );
};

export default App;
