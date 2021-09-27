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
}

export interface StrokeSegment {
  start: Point;
  end: Point;
}

export interface Dot {
  center: Point;
}
