import React, { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const ActivityController: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const history = useHistory();
  const location = useLocation();

  const handleActivityNaviagtion = useCallback(
    (path: string) => {
      if (path === '/room/game' && !state.room.activity) {
        history.push('/room/lobby');
      }
    },
    [history, state.room.activity],
  );

  useEffect(() => {
    handleActivityNaviagtion(location.pathname);
  }, [handleActivityNaviagtion, location]);

  useEffect(
    () => () => {
      if (state.room.hostname === state.artist.name) {
        socket.emit('end_game');
      }
      dispatch({ type: 'exit-activity' });
    },
    [dispatch, state.artist.name, state.room.hostname],
  );

  return null;
};

export default ActivityController;
