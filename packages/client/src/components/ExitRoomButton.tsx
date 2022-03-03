import React, { useState } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import socket from '../services/socket';
import ConfirmationDialog from './ConfirmationDialog';
import { useAppContext } from './AppContextProvider';

export type ExitRoomButtonProps = ButtonProps;

const ExitRoomButton: React.FC<ExitRoomButtonProps> = (props) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { dispatch } = useAppContext();

  const closeDialog = () => {
    setDialogIsOpen(false);
  };

  const openDialog = () => {
    setDialogIsOpen(true);
  };

  const exitRoom = () => {
    dispatch({ type: 'exit-room' });
    socket.emit('artist_leave');
  };

  return (
    <>
      <Button color="secondary" variant="contained" onClick={openDialog} {...props}>
        Exit Room
      </Button>
      <ConfirmationDialog
        open={dialogIsOpen}
        onCancel={closeDialog}
        onConfirm={exitRoom}
        onClose={closeDialog}
        title="Are you sure you want to exit the room?"
        message="You will not be able to rejoin an activity in progress."
        cancelText="Cancel"
        confirmText="Exit"
      />
    </>
  );
};

export default ExitRoomButton;
