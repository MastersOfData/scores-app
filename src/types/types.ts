import { User, Membership, GameType } from "../fire-base/models";

export type WithId<T> = {
  id: string;
} & T;

export type GameStatus = "FINISHED" | "PAUSED" | "ONGOING";

export type PlayerScore = {
  playerId: string;
  points: number;
};
export type Member = WithId<Membership> & User;

export interface GroupInternal {
  id: string;
  name: string;
  emoji: string;
  games: string[];
  invitationCode: string;
  gameTypes?: GameType[];
  members: Member[];
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
