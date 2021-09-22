export interface ChatMessage {
  senderID: string;
  senderName: string;
  content: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface GameUser {
  userName: string;
}

export interface GameData {
  content: any;
}
