import type { DocumentData, Timestamp } from "firebase/firestore";
import { GameStatus, GameType, PlayerScore } from "src/types/types";

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

export enum GameActionType {
  ADD_POINTS
}

export interface GameAction extends DocumentData {
  gameId: string,
  actorId: string,
  subjectId: string,
  actionType: GameActionType
  value?: number,
  timestamp: Timestamp
}

export interface Membership extends DocumentData {
  userId: string;
  groupId: string;
  wins: number;
  draws: number;
  losses: number;
}
