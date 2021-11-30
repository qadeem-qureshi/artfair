export interface ChatMessage {
  sender: string;
  content: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface UserData {
  name: string;
  roomname: string;
  avatarIndex: number;
}

export interface MemberData {
  name: string;
  avatarIndex: number;
}

export interface RoomCreationData {
  username: string;
  roomname: string;
}

export interface RoomJoinData {
  username: string;
  roomname: string;
  roomMembers: MemberData[];
}

export interface RoomData {
  members: MemberData[];
}

export interface StrokeSegment {
  start: Point;
  end: Point;
  color: string;
  thickness: number;
}

export type Activity = 'art-collab' | 'con-artist' | 'canvas-swap' | 'art-dealer' | 'art-critic';
