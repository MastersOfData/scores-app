import type { DocumentData, Timestamp } from "firebase/firestore";
import {
  GameActionType,
  GameStatus,
  GameType,
  PlayerScore,
} from "src/types/types";

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

export interface Game extends DocumentData {
  gameTypeId: string;
  groupId: string;
  adminId: string;
  players: PlayerScore[];
  winners?: string[];
  timestamp: Timestamp;
  duration?: number;
  status: GameStatus;
}

export interface GameAction extends DocumentData {
  gameId: string;
  actorId: string;
  actionType: GameActionType;
  timestamp: Timestamp;
  subjectId?: string;
  value?: number;
}

export interface Membership extends DocumentData {
  userId: string;
  groupId: string;
  wins: number;
  draws: number;
  losses: number;
}
