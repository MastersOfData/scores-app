import { User } from "src/fire-base/models";

export type WithId<T> = {
  id: string;
} & T;

export type GameStatus = "FINISHED" | "PAUSED" | "ONGOING";

export type Player = ((WithId<User> & { points: number }) | undefined)[];

export type PlayerScore = {
  playerId: string;
  points: number;
}