import { DialogProps } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useRoomContext } from './RoomContextProvider';
import ConfirmationDialog from './ConfirmationDialog';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

export type KickAlertProps = Omit<DialogProps, 'open'>;

const KickAlert: React.FC<KickAlertProps> = (props) => {
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const { state, dispatch } = useRoomContext();
  const { dispatch: appDispatch } = useAppContext();

  const closeAlert = () => {
    setAlertIsOpen(false);
  };

  const openAlert = () => {
    setAlertIsOpen(true);
  };

  const handleClose = () => {
    closeAlert();
    appDispatch({ type: 'exit-room' });
  };

  const handleKickArtist = useCallback(
    (username: string) => {
      if (state.artist.name === username) {
        openAlert();
      } else {
        dispatch({ type: 'artist-leave', username });
      }
    },
    [dispatch, state.artist.name],
  );

  useEffect(() => {
    socket.on('kick_artist', handleKickArtist);
    return () => {
      socket.off('kick_artist', handleKickArtist);
    };
  }, [handleKickArtist]);

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
