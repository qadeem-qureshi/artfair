import React, { createContext, useContext, useReducer } from 'react';
import {
  ACTIVITIES, Activity, Artist, Room,
} from '@artfair/common';
import { modulo } from '../util/math';

interface RoomState {
  artist: Artist;
  room: Room;
}

type RoomAction =
  | { type: 'artist-join'; artist: Artist }
  | { type: 'artist-leave'; username: string }
  | { type: 'start-activity'; activity: Activity }
  | { type: 'set-host'; hostname: string }
  | { type: 'start-discussion' }
  | { type: 'end-activity' }
  | { type: 'next-activity' }
  | { type: 'previous-activity' };

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
          stage: 'activity',
        },
        room: {
          ...state.room,
          activity: action.activity,
          members: state.room.members.map((member) => ({ ...member, stage: 'activity' })),
          stage: 'activity',
        },
      };
    case 'start-discussion':
      return {
        ...state,
        artist: {
          ...state.artist,
          stage: 'discussion',
        },
        room: {
          ...state.room,
          members: state.room.members.map((member) => ({
            ...member,
            stage: member.stage === state.room.stage ? 'discussion' : member.stage,
          })),
          stage: 'discussion',
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
    case 'end-activity':
      return {
        ...state,
        artist: {
          ...state.artist,
          stage: 'lobby',
        },
        room: {
          ...state.room,
          members: state.room.members.map((member) => ({ ...member, stage: 'lobby' })),
          stage: 'lobby',
        },
      };
    case 'next-activity':
      return {
        ...state,
        room: {
          ...state.room,
          activity: ACTIVITIES[modulo(ACTIVITIES.indexOf(state.room.activity) + 1, ACTIVITIES.length)],
        },
      };
    case 'previous-activity':
      return {
        ...state,
        room: {
          ...state.room,
          activity: ACTIVITIES[modulo(ACTIVITIES.indexOf(state.room.activity) - 1, ACTIVITIES.length)],
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