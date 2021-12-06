import React, { createContext, useContext, useReducer } from 'react';
import { Activity, MemberData, UserData } from '@artfair/common';
import { PALETTES } from '../util/palette';

interface AppData {
  userData: UserData;
  color: string;
  thickness: number;
  roomMembers: MemberData[];
  isHost: boolean;
  activity: Activity;
  context: CanvasRenderingContext2D | null;
}

const DEFAULT_APP_DATA: AppData = {
  userData: { name: '', roomname: '', avatarIndex: 0 },
  color: PALETTES.WINTER[0],
  thickness: 10,
  roomMembers: [],
  isHost: false,
  activity: 'con-artist',
  context: null,
};

type AppAction =
  | { type: 'set-color'; color: string }
  | { type: 'set-thickness'; thickness: number }
  | { type: 'create-room'; userData: UserData }
  | { type: 'join-room'; userData: UserData; roomMembers: MemberData[] }
  | { type: 'user-join'; memberData: MemberData }
  | { type: 'user-leave'; username: string }
  | { type: 'set-activity'; activity: Activity }
  | { type: 'set-context'; context: CanvasRenderingContext2D };

const AppReducer = (state: AppData, action: AppAction): AppData => {
  switch (action.type) {
    case 'set-color':
      return {
        ...state,
        color: action.color,
      };
    case 'set-thickness':
      return {
        ...state,
        thickness: action.thickness,
      };
    case 'create-room':
      return {
        ...state,
        userData: action.userData,
        isHost: true,
        roomMembers: [{ name: action.userData.name, avatarIndex: action.userData.avatarIndex }],
      };
    case 'join-room':
      return {
        ...state,
        userData: action.userData,
        roomMembers: action.roomMembers,
        isHost: false,
      };
    case 'user-join':
      return {
        ...state,
        roomMembers: [...state.roomMembers, action.memberData],
      };
    case 'user-leave':
      return {
        ...state,
        roomMembers: state.roomMembers.filter((member) => member.name !== action.username),
      };
    case 'set-activity':
      return {
        ...state,
        activity: action.activity,
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
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
