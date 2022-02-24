import React, { useState } from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import socket from '../services/socket';
import ConfirmationDialog from './ConfirmationDialog';
import { useRoomContext } from './RoomContextProvider';

export type StartDiscussionButtonProps = ButtonProps;

const StartDiscussionButton: React.FC<StartDiscussionButtonProps> = (props) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { dispatch } = useRoomContext();

  const closeDialog = () => {
    setDialogIsOpen(false);
  };

  const openDialog = () => {
    setDialogIsOpen(true);
  };

  const startDiscussion = () => {
    dispatch({ type: 'start-discussion' });
    socket.emit('start_discussion');
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={openDialog} {...props}>
        Start Discussion
      </Button>
      <ConfirmationDialog
        open={dialogIsOpen}
        onCancel={closeDialog}
        onConfirm={startDiscussion}
        onClose={closeDialog}
        title="Are you sure you want to start the discussion?"
        message="The canvas will be cleared."
        cancelText="Cancel"
        confirmText="Continue"
      />
    </>
  );
};

export default StartDiscussionButton;
