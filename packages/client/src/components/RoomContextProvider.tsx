import React, { createContext, useContext, useReducer } from 'react';
import { Activity, MemberData } from '@artfair/common';

interface RoomData {
  username: string;
  roomname: string;
  roomMembers: MemberData[];
  isHost: boolean;
  activity: Activity;
  avatarIndex: number;
}

const DEFAULT_ROOM_DATA: RoomData = {
  username: '',
  roomname: '',
  roomMembers: [],
  isHost: false,
  activity: 'con-artist',
  avatarIndex: 0,
};

type RoomAction =
  | { type: 'create-room'; username: string; roomname: string }
  | { type: 'join-room'; username: string; roomname: string; roomMembers: MemberData[] }
  | { type: 'user-join'; username: string, avatarIndex: number }
  | { type: 'user-leave'; username: string }
  | { type: 'set-activity'; activity: Activity }
  | { type: 'set-avatar-index'; index: number };

const RoomReducer = (state: RoomData, action: RoomAction): RoomData => {
  switch (action.type) {
    case 'create-room':
      return {
        ...state,
        username: action.username,
        roomname: action.roomname,
        isHost: true,
        roomMembers: [{ name: action.username, avatarIndex: state.avatarIndex }],
      };
    case 'join-room':
      return {
        ...state,
        username: action.username,
        roomname: action.roomname,
        roomMembers: action.roomMembers,
        isHost: false,
      };
    case 'user-join':
      return {
        ...state,
        roomMembers: [
          ...state.roomMembers,
          { name: action.username, avatarIndex: action.avatarIndex },
        ],
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
    case 'set-avatar-index':
      return {
        ...state,
        avatarIndex: action.index,
      };
    default:
      throw new Error('Invalid action.');
  }
};

interface RoomContextData {
  state: RoomData;
  dispatch: React.Dispatch<RoomAction>;
}

const RoomContext = createContext<RoomContextData | null>(null);

export const useRoomContext = (): RoomContextData => {
  const context = useContext(RoomContext);
  if (context == null) throw new Error('Room context has not been initialized.');
  return context;
};

const RoomContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(RoomReducer, DEFAULT_ROOM_DATA);
  return <RoomContext.Provider value={{ state, dispatch }}>{children}</RoomContext.Provider>;
};

export default RoomContextProvider;
