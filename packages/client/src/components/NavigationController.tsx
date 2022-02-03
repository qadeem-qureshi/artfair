import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import socket from '../services/socket';
import { useAppContext } from './AppContextProvider';

const NavigationController: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const history = useHistory();

  const handleEndGame = useCallback(
    () => {
      history.push('/room/lobby');
    },
    [history],
  );

  useEffect(() => {
    // Redirect users who are not in a room
    if (state.room.gamestate === 'no-game') {
      history.push('/room/lobby');
    }
  }, [history, state.room.gamestate]);

  useEffect(() => () => {
    dispatch({ type: 'set-gamestate', gamestate: 'no-game' });
  }, [dispatch]);

  useEffect(() => {
    socket.on('end_game', handleEndGame);
    return () => {
      socket.off('end_game', handleEndGame);
    };
  }, [handleEndGame]);

  return (<> </>);
};

export default NavigationController;
