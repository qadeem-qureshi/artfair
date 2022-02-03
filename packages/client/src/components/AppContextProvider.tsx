import React, { createContext, useContext, useReducer } from 'react';
import { JoinRoomData } from '@artfair/common';

interface AppState {
  joinRoomData: JoinRoomData | null;
}

type AppAction = { type: 'join-room'; data: JoinRoomData } | { type: 'exit-room' };

const DEFAULT_APP_STATE: AppState = {
  joinRoomData: null,
};

const AppReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'join-room':
      return {
        ...state,
        joinRoomData: action.data,
      };
    case 'exit-room':
      return {
        ...state,
        joinRoomData: null,
      };
    default:
      throw new Error('Invalid action.');
  }
};

interface AppContextData {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextData | null>(null);

export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext);
  if (context == null) throw new Error('App context has not been initialized.');
  return context;
};

const AppContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, DEFAULT_APP_STATE);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
