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
  | { type: 'start-activity'; activity: Activity; prompt?: string }
  | { type: 'start-discussion' }
  | { type: 'end-discussion' }
  | { type: 'set-host'; hostname: string }
  | { type: 'next-activity' }
  | { type: 'previous-activity' }

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
          members: state.room.members.filter(
            (member) => member.name !== action.username,
          ),
        },
      };
    case 'start-activity':
      return {
        ...state,
        artist: {
          ...state.artist,
          stage:
            state.artist.name === state.room.hostname
            || state.artist.stage === state.room.stage
              ? 'activity'
              : state.artist.stage,
          prompt: action.prompt,
        },
        room: {
          ...state.room,
          activity: action.activity,
          members: state.room.members.map((member) => ({
            ...member,
            stage:
              member.stage === state.room.stage ? 'activity' : member.stage,
          })),
          stage: 'activity',
        },
      };
    case 'start-discussion':
      return {
        ...state,
        artist: {
          ...state.artist,
          stage:
            state.artist.name === state.room.hostname
            || state.artist.stage === state.room.stage
              ? 'discussion'
              : state.artist.stage,
        },
        room: {
          ...state.room,
          members: state.room.members.map((member) => ({
            ...member,
            stage:
              member.stage === state.room.stage ? 'discussion' : member.stage,
          })),
          stage: 'discussion',
        },
      };
    case 'end-discussion':
      return {
        ...state,
        artist: {
          ...state.artist,
          stage:
            state.artist.name === state.room.hostname
            || state.artist.stage === state.room.stage
              ? 'lobby'
              : state.artist.stage,
        },
        room: {
          ...state.room,
          members: state.room.members.map((member) => ({
            ...member,
            stage: member.stage === state.room.stage ? 'lobby' : member.stage,
          })),
          stage: 'lobby',
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
    case 'next-activity':
      return {
        ...state,
        room: {
          ...state.room,
          activity:
            ACTIVITIES[
              modulo(
                ACTIVITIES.indexOf(state.room.activity) + 1,
                ACTIVITIES.length,
              )
            ],
        },
      };
    case 'previous-activity':
      return {
        ...state,
        room: {
          ...state.room,
          activity:
            ACTIVITIES[
              modulo(
                ACTIVITIES.indexOf(state.room.activity) - 1,
                ACTIVITIES.length,
              )
            ],
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
  if (context == null) {
    throw new Error('Room context has not been initialized.');
  }
  return context;
};

export interface RoomContextProviderProps {
  defaultRoomState: RoomState;
}

const RoomContextProvider: React.FC<RoomContextProviderProps> = ({
  defaultRoomState,
  children,
}) => {
  const [state, dispatch] = useReducer(RoomReducer, defaultRoomState);
  return (
    <RoomContext.Provider value={{ state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;
