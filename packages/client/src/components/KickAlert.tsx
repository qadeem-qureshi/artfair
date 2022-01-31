import { DialogProps } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from './AppContextProvider';
import ConfirmationDialog from './ConfirmationDialog';
import socket from '../services/socket';

export type KickAlertProps = Omit<DialogProps, 'open'>;

const KickAlert: React.FC<KickAlertProps> = (props) => {
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const { state, dispatch } = useAppContext();

  const closeAlert = () => {
    setAlertIsOpen(false);
  };

  const openAlert = () => {
    setAlertIsOpen(true);
  };

  const handleClose = () => {
    closeAlert();
    dispatch({ type: 'exit-room' });
  };

  const handleKick = useCallback(
    (username: string) => {
      if (state.artist.name === username) {
        openAlert();
      } else {
        dispatch({ type: 'user-leave', username });
      }
    },
    [dispatch, state.artist.name],
  );

  useEffect(() => {
    socket.on('kick', handleKick);
    return () => {
      socket.off('kick', handleKick);
    };
  }, [handleKick]);

  return (
    <ConfirmationDialog
      open={alertIsOpen}
      onCancel={handleClose}
      onConfirm={handleClose}
      onClose={handleClose}
      title="You have been kicked from the room!"
      message="If you believe the host kicked you by mistake, you may rejoin the room."
      confirmText="Ok"
      {...props}
    />
  );
};

export default KickAlert;
