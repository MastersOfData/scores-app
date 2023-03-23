import { Game, User, UserGroupStatistic } from "src/fire-base/models";

export type WithId<T> = {
  id: string;
} & T;

export type GameState = "FINISHED" | "PAUSED" | "ONGOING";

export type Player = ((WithId<User> & { points: number }) | undefined)[];

export interface GameInternal extends Omit<Game, "players"> {
  players: Player;
}
