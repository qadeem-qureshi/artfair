import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import socket from '../services/socket';
import { useRoomContext } from './RoomContextProvider';

export type EndActivityButtonProps = ButtonProps;

const EndActivityButton: React.FC<EndActivityButtonProps> = (props) => {
  const { dispatch } = useRoomContext();

  const endActivity = () => {
    dispatch({ type: 'end-activity' });
    socket.emit('end_activity');
  };

  return (
    <Button color="primary" variant="contained" onClick={endActivity} {...props}>
      End Activity
    </Button>
  );
};

export default EndActivityButton;
