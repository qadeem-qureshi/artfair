import { IconButton, IconButtonProps } from '@material-ui/core';
import DeleteRounded from '@material-ui/icons/DeleteRounded';
import React, { useState } from 'react';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';
import ConfirmationDialog from './ConfirmationDialog';

export type ClearButtonProps = IconButtonProps;

const ClearButton: React.FC<ClearButtonProps> = (props) => {
  const { state } = useAppContext();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleClose = () => {
    setDialogIsOpen(false);
  };

  const handleOpen = () => {
    setDialogIsOpen(true);
  };

  const handleClear = () => {
    requestAnimationFrame(() => {
      if (!state.context) return;
      state.context.fillStyle = 'white';
      state.context.fillRect(0, 0, state.context.canvas.width, state.context.canvas.height);
    });
    socket.emit('clear_canvas');
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary" {...props}>
        <DeleteRounded />
      </IconButton>
      <ConfirmationDialog
        open={dialogIsOpen}
        onCancel={handleClose}
        onConfirm={handleClear}
        onClose={handleClose}
        title="Are you sure you want to clear the canvas?"
        message="All your progress will be lost!"
        cancelText="Cancel"
        confirmText="Clear"
      />
    </>
  );
};

export default ClearButton;
