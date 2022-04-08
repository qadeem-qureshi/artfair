import React, { useCallback, useEffect, useState } from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  paper: {
    padding: '1.5rem',
  },
  title: {
    padding: '0',
  },
  content: {
    padding: '1rem 0',
    display: 'grid',
    placeItems: 'center',
  },
});

export type DisconnectProps = Omit<DialogProps, 'open'>;

const DisconnectAlert: React.FC<DisconnectProps> = (props) => {
  const [isDisconnected, setIsDisconnected] = useState(false);
  const { dispatch } = useAppContext();
  const classes = useStyles();

  const handleDisconnect = useCallback(() => {
    dispatch({ type: 'exit-room' });
    setIsDisconnected(true);
  }, [dispatch]);

  const handleReconnect = () => {
    setIsDisconnected(false);
  };

  useEffect(() => {
    socket.on('disconnect', handleDisconnect);
    socket.io.on('reconnect', handleReconnect);
    return () => {
      socket.off('disconnect', handleDisconnect);
      socket.io.on('reconnect', handleReconnect);
    };
  }, [handleDisconnect]);

  return (
    <Dialog PaperProps={{ className: classes.paper, elevation: 1 }} open={isDisconnected} {...props}>
      <DialogTitle className={classes.title}>
        Reconnecting to server...
      </DialogTitle>
      <DialogContent className={classes.content}>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
};

export default DisconnectAlert;
