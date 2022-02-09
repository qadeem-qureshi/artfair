import { DialogProps } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useRoomContext } from './RoomContextProvider';
import ConfirmationDialog from './ConfirmationDialog';
import socket from '../services/socket';

export type HostPromotionAlertProps = Omit<DialogProps, 'open'>;

const HostPromotionAlert: React.FC<HostPromotionAlertProps> = (props) => {
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const { state, dispatch } = useRoomContext();

  const closeAlert = () => {
    setAlertIsOpen(false);
  };

  const openAlert = () => {
    setAlertIsOpen(true);
  };

  const handleHostPromotion = useCallback(
    (hostname: string) => {
      dispatch({ type: 'set-host', hostname });
      if (state.artist.name === hostname) {
        openAlert();
      }
    },
    [dispatch, state.artist],
  );

  useEffect(() => {
    socket.on('promote_host', handleHostPromotion);
    return () => {
      socket.off('promote_host', handleHostPromotion);
    };
  }, [handleHostPromotion]);

  return (
    <ConfirmationDialog
      open={alertIsOpen}
      onCancel={closeAlert}
      onConfirm={closeAlert}
      onClose={closeAlert}
      title="You have been promoted to room host!"
      message="As host, you have the ability to control activities, kick out malicious artists, or transfer your power to another artist."
      confirmText="Ok"
      {...props}
    />
  );
};

export default HostPromotionAlert;
