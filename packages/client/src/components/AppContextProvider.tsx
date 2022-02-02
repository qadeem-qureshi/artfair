import React, { createContext, useContext, useReducer } from 'react';
import { Activity, Artist, Room } from '@artfair/common';

interface AppState {
  artist: Artist;
  room: Room;
}

const DEFAULT_APP_STATE: AppState = {
  artist: { name: '', avatarIndex: 0 },
  room: {
    name: '',
    members: [],
    hostname: '',
    activity: 'free-draw',
  },
};

type AppAction =
  | { type: 'join-room'; artist: Artist, room: Room }
  | { type: 'user-join'; artist: Artist }
  | { type: 'user-leave'; username: string }
  | { type: 'set-activity'; activity: Activity }
  | { type: 'set-host'; hostname: string }
  | { type: 'exit-room' };

const AppReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'join-room':
      return {
        artist: action.artist,
        room: action.room,
      };
    case 'user-join':
      return {
        ...state,
        room: {
          ...state.room,
          members: [...state.room.members, action.artist],
        },
      };
    case 'user-leave':
      return {
        ...state,
        room: {
          ...state.room,
          members: state.room.members.filter((member) => member.name !== action.username),
        },
      };
    case 'set-activity':
      return {
        ...state,
        room: {
          ...state.room,
          activity: action.activity,
        },
      };
    case 'set-host':
      return {
        ...state,
        room: {
          ...state.room,
          hostname: action.hostname,
        },
      };
    case 'exit-room':
      return DEFAULT_APP_STATE;
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
