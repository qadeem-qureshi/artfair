export type Activity = 'free-draw' | 'art-collab' | 'con-artist' | 'canvas-swap' | 'art-dealer';

export const ACTIVITIES: Activity[] = ['free-draw', 'art-collab', 'con-artist', 'canvas-swap', 'art-dealer'];

export const DEFAULT_ACTIVITY: Activity = 'free-draw';

export type Stage = 'lobby' | 'activity' | 'discussion';

export const DEFAULT_STAGE: Stage = 'lobby';

export interface ChatMessage {
  sender: string;
  content: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Artist {
  name: string;
  avatarIndex: number;
  stage: Stage;
  prompt?: string;
  roomname: string;
}

export interface LoginData {
  name: string;
  roomname: string;
  avatarIndex: number;
}

export interface Room {
  name: string;
  members: Artist[];
  hostname: string;
  activity: Activity;
  stage: Stage;
}

export interface JoinRoomData {
  artist: Artist;
  room: Room;
}

export type Color = string;

export interface StrokeBeginData {
  strokeId: string;
  strokeColor: Color;
  strokeThickness: number;
  point: Point;
}

export interface StrokeContinueData {
  strokeId: string;
  point: Point;
}

export interface StrokeEndData {
  strokeId: string;
  point: Point;
}
