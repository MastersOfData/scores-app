import { User, Membership } from "../fire-base/models";

export type WithId<T> = {
  id: string;
} & T;

export type Member = WithId<Membership> & User;

export interface GroupInternal {
  id: string;
  name: string;
  emoji: string;
  games: string[];
  invitationCode: string;
  gameTypes?: { name: string; emoji: string }[];
  members: Member[];
}
