import type { DocumentData, Timestamp } from "firebase/firestore"

// id is not part of document data
export interface Example extends DocumentData {
  name: string,
  age: number
}

export interface User extends DocumentData {
  email: string;
  username: string;
}

export interface Group extends DocumentData {
  name: string;
  emoji: string;
  games: string[];
  invitationCode: string;
}

type GameState = "FINISHED" | "PAUSED" | "ONGOING";

export interface Game extends DocumentData {
  gameTypeId: string;
  groupId?: string;
  players: [playerId: string, points: number]
  winner?: string;
  timestamp: Timestamp
  duration?: number;
  state: GameState;
}

export interface UserGroupStatistic extends DocumentData {
  userId: string;
  groupId: string;
  wins: number;
  draws: number;
  losses: number;
}