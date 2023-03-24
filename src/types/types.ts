import { User, Membership } from "../fire-base/models";

export type WithId<T> = {
  id: string;
} & T;

export type GameStatus = "FINISHED" | "PAUSED" | "ONGOING";

export type Player = ((WithId<User> & { points: number }) | undefined)[];

export type PlayerScore = {
  playerId: string;
  points: number;
}
export interface GroupInternal {
  id: string;
  name: string;
  emoji: string;
  games: string[];
  invitationCode: string;
  gameTypes?: { name: string; emoji: string }[];
  members: ((WithId<Membership> & User) | undefined)[];
}
