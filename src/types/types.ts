import { Document } from "src/fire-base/db";
import { User, Membership } from "../fire-base/models";

export enum GameActionType {
  ADD_POINTS = "addPoints",
  START = "start",
  CONTINUE = "continue",
  PAUSE = "pause",
  FINISH = "finish",
}

export type GameStatus = "FINISHED" | "PAUSED" | "ONGOING";

export type PlayerScore = {
  playerId: string;
  points: number;
};

export type Member = Document<Membership> & User;

export interface GroupInternal {
  id: string;
  name: string;
  emoji: string;
  games: string[];
  invitationCode: string;
  gameTypes?: GameType[];
  members: Member[];
}

export interface GameType {
  id: string;
  name: string;
  emoji: string;
}

export interface LeaderboardStats {
  userId: string;
  username: string;
  wins: number;
  draws: number;
  losses: number;
  winRatio: number;
  gamesPlayed: number;
}

export interface UserAccess {
  hasAccess: boolean;
  noAccessReason?: string;
}
