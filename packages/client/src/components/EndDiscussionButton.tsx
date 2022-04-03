import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import socket from '../services/socket';
import { useRoomContext } from './RoomContextProvider';

export type EndDiscussionButtonProps = ButtonProps;

const EndDiscussionButton: React.FC<EndDiscussionButtonProps> = (props) => {
  const { dispatch } = useRoomContext();

  const endDiscussion = () => {
    dispatch({ type: 'end-discussion' });
    socket.emit('end_discussion');
  };

  return (
    <Button color="primary" variant="contained" onClick={endDiscussion} {...props}>
      Return to Lobby
    </Button>
  );
};

export default EndDiscussionButton;
