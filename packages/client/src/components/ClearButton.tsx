import React, { useState } from 'react';
import { IconButton, IconButtonProps } from '@material-ui/core';
import DeleteRounded from '@material-ui/icons/DeleteRounded';
import socket from '../services/socket';
import { useCanvasContext } from './CanvasContextProvider';
import ConfirmationDialog from './ConfirmationDialog';

export type ClearButtonProps = IconButtonProps;

const ClearButton: React.FC<ClearButtonProps> = (props) => {
  const { state } = useCanvasContext();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const closeDialog = () => {
    setDialogIsOpen(false);
  };

  const openDialog = () => {
    setDialogIsOpen(true);
  };

  const clear = () => {
    if (!state.canvasElement) return;
    const clearEvent = new Event('clear');
    state.canvasElement.dispatchEvent(clearEvent);
    socket.emit('clear_canvas');
    closeDialog();
  };

  return (
    <>
      <IconButton onClick={openDialog} color="primary" {...props}>
        <DeleteRounded />
      </IconButton>
      <ConfirmationDialog
        open={dialogIsOpen}
        onCancel={closeDialog}
        onConfirm={clear}
        onClose={closeDialog}
        title="Are you sure you want to clear the canvas?"
        message="All your progress will be lost!"
        cancelText="Cancel"
        confirmText="Clear"
      />
    </>
  );
};

export default ClearButton;
