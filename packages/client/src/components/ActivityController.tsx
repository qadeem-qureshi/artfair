import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const ActivityController: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const history = useHistory();

  // Redirect when there is no activity in progress
  useEffect(() => {
    if (!state.room.activity) {
      history.push('/room/lobby');
    }
  }, [history, state.room.activity]);

  // End activity if host leaves
  useEffect(
    () => () => {
      if (state.room.hostname === state.artist.name) {
        dispatch({ type: 'exit-activity' });
        socket.emit('end_game');
      }
    },
    [dispatch, state.artist.name, state.room.hostname],
  );

  return null;
};

export default ActivityController;
