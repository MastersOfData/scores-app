import type { DocumentData, Timestamp } from "firebase/firestore";

// id is not part of document data

export interface User extends DocumentData {
  email: string;
  username: string;
}

export interface Group extends DocumentData {
  name: string;
  emoji: string;
  games: string[];
  invitationCode: string;
  gameTypes?: GameType[];
}

type GameState = "FINISHED" | "PAUSED" | "ONGOING";

export interface Game extends DocumentData {
  gameTypeId: string;
  groupId?: string;
  players: { playerId: string; points: number }[];
  winner?: string;
  timestamp: Timestamp;
  duration?: number;
  state: GameState;
}

export interface Membership extends DocumentData {
  userId: string;
  groupId: string;
  wins: number;
  draws: number;
  losses: number;
}

export interface GameType {
  name: string;
  emoji: string;
}
