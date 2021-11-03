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
  room: string;
}

export interface RoomData {
  name: string;
  members: Set<string>;
}

export interface RoomRequestData {
  username: string;
  room: string;
}

export interface StrokeSegment {
  start: Point;
  end: Point;
  color: string;
  thickness: number;
}
