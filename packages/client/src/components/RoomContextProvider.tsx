import React, { createContext, useContext, useReducer } from 'react';
import { Activity, Artist, Room } from '@artfair/common';

interface RoomState {
  artist: Artist;
  room: Room;
}

type RoomAction =
  | { type: 'artist-join'; artist: Artist }
  | { type: 'artist-leave'; username: string }
  | { type: 'start-activity'; activity: Activity }
  | { type: 'set-host'; hostname: string }
  | { type: 'exit-activity' };

const RoomReducer = (state: RoomState, action: RoomAction): RoomState => {
  switch (action.type) {
    case 'artist-join':
      return {
        ...state,
        room: {
          ...state.room,
          members: [...state.room.members, action.artist],
        },
      };
    case 'artist-leave':
      return {
        ...state,
        room: {
          ...state.room,
          members: state.room.members.filter((member) => member.name !== action.username),
        },
      };
    case 'start-activity':
      return {
        ...state,
        artist: {
          ...state.artist,
          isPartOfActivity: true,
        },
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
    case 'exit-activity':
      return {
        ...state,
        artist: {
          ...state.artist,
          isPartOfActivity: false,
        },
        room: {
          ...state.room,
          activity: null,
        },
      };
    default:
      throw new Error('Invalid action.');
  }
};

interface RoomContextData {
  state: RoomState;
  dispatch: React.Dispatch<RoomAction>;
}

const RoomContext = createContext<RoomContextData | null>(null);

export const useRoomContext = (): RoomContextData => {
  const context = useContext(RoomContext);
  if (context == null) throw new Error('Room context has not been initialized.');
  return context;
};

export interface RoomContextProviderProps {
  defaultRoomState: RoomState;
}

const RoomContextProvider: React.FC<RoomContextProviderProps> = ({ defaultRoomState, children }) => {
  const [state, dispatch] = useReducer(RoomReducer, defaultRoomState);
  return <RoomContext.Provider value={{ state, dispatch }}>{children}</RoomContext.Provider>;
};

export default RoomContextProvider;
