import { IconButton, IconButtonProps } from '@material-ui/core';
import DeleteRounded from '@material-ui/icons/DeleteRounded';
import React from 'react';
import socket from '../services/socket';
import { useCanvasContext } from './CanvasContextProvider';

export type ClearButtonProps = IconButtonProps;

const ClearButton: React.FC<ClearButtonProps> = (props) => {
  const { state } = useCanvasContext();

  const handleClear = () => {
    if (!state.canvasElement) return;
    const clearEvent = new Event('clear');
    state.canvasElement.dispatchEvent(clearEvent);
    socket.emit('clear_canvas');
  };

  return (
    <IconButton onClick={handleClear} color="primary" {...props}>
      <DeleteRounded />
    </IconButton>
  );
};

export default ClearButton;
