import React, { createContext, useContext, useReducer } from 'react';

interface AppData {
  username: string;
  room: string;
  color: string;
  thickness: number;
  context: CanvasRenderingContext2D | null;
}

const DEFAULT_APP_DATA: AppData = {
  username: '',
  room: '',
  color: 'black',
  thickness: 10,
  context: null,
};

type AppAction =
  | { type: 'initialize-user'; username: string; room: string }
  | { type: 'select-color'; color: string }
  | { type: 'select-thickness'; thickness: number }
  | { type: 'set-context'; context: CanvasRenderingContext2D };

const AppReducer = (state: AppData, action: AppAction): AppData => {
  switch (action.type) {
    case 'initialize-user':
      return {
        ...state,
        username: action.username,
        room: action.room,
      };
    case 'select-color':
      return {
        ...state,
        color: action.color,
      };
    case 'select-thickness':
      return {
        ...state,
        thickness: action.thickness,
      };
    case 'set-context':
      return {
        ...state,
        context: action.context,
      };
    default:
      throw new Error('Invalid action.');
  }
};

interface AppContextData {
  state: AppData;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextData | null>(null);

export const useAppContext = (): AppContextData => {
  const context = useContext(AppContext);
  if (context == null) throw new Error('App context has not been initialized.');
  return context;
};

const AppContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, DEFAULT_APP_DATA);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
