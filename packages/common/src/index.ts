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

export interface StrokeBeginData {
  strokeId: string;
  strokeColor: string;
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

export type Activity = 'art-collab' | 'con-artist' | 'canvas-swap' | 'art-dealer' | 'art-critic';
