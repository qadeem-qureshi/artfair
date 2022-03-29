import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import socket from '../services/socket';
import { useRoomContext } from './RoomContextProvider';

export type StartDiscussionButtonProps = ButtonProps;

const StartDiscussionButton: React.FC<StartDiscussionButtonProps> = (props) => {
  const { dispatch } = useRoomContext();

  const startDiscussion = () => {
    dispatch({ type: 'start-discussion' });
    socket.emit('start_discussion');
  };

  return (
    <Button color="primary" variant="contained" onClick={startDiscussion} {...props}>
      Begin Discussion
    </Button>
  );
};

export default StartDiscussionButton;
