import React, { createContext, useContext, useReducer } from 'react';
import { Activity, MemberData, UserData } from '@artfair/common';

interface RoomData {
  userData: UserData;
  roomMembers: MemberData[];
  isHost: boolean;
  activity: Activity;
  avatarIndex: number;
}

const DEFAULT_ROOM_DATA: RoomData = {
  userData: { name: '', roomname: '', avatarIndex: 0 },
  roomMembers: [],
  isHost: false,
  activity: 'con-artist',
  avatarIndex: 0,
};

type RoomAction =
| { type: 'create-room'; userData: UserData }
| { type: 'join-room'; userData: UserData; roomMembers: MemberData[] }
| { type: 'user-join'; memberData: MemberData }
| { type: 'user-leave'; username: string }
| { type: 'set-activity'; activity: Activity };

const RoomReducer = (state: RoomData, action: RoomAction): RoomData => {
  switch (action.type) {
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
