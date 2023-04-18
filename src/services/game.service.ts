import { Timestamp, where } from "firebase/firestore";
import {
  addDocument,
  collections,
  getDocument,
  getDocuments,
  updateDocument,
} from "src/fire-base/db";
import { Game } from "src/fire-base/models";
import { calculateDuration } from "src/utils/util";

export interface CreateGameData {
  groupId: string;
  gameTypeId: string;
  allowTeams: boolean;
  participants: string[];
}

export interface RegisterResultData {
  groupId: string;
  gameTypeId: string;
  participants: string[];
  winners: string[];
}

export type UpdateGameData = Pick<Game, "winner" | "status">;

export const createGame = async (userId: string, data: CreateGameData) => {
  const players = data.participants.map((participantId) => ({
    playerId: participantId,
    points: 0,
  }));

  const game: Game = {
    groupId: data.groupId,
    gameTypeId: data.gameTypeId,
    allowTeams: data.allowTeams,
    adminId: userId,
    players: [...players, { playerId: userId, points: 0 }],
    timestamp: Timestamp.fromDate(new Date()),
    status: "ONGOING",
    duration: 0,
  };

  const gameRef = await addDocument(collections.games, game);
  const createdGame = await getDocument(collections.games, gameRef.id);

  if (!createdGame) return Promise.reject();

  return createdGame;
};

export const registerResult = async (
  userId: string,
  data: RegisterResultData
) => {
  const players = data.participants.map((participantId) => {
    const isWinner = data.winners.includes(participantId);
    return {
      playerId: participantId,
      points: isWinner ? 1 : 0,
    };
  });

  const game: Game = {
    groupId: data.groupId,
    gameTypeId: data.gameTypeId,
    allowTeams: false,
    adminId: userId,
    players,
    timestamp: Timestamp.fromDate(new Date()),
    status: "FINISHED",
    duration: 0,
    winners: data.winners,
  };

  const gameRef = await addDocument(collections.games, game);
  const createdGame = await getDocument(collections.games, gameRef.id);

  if (!createdGame) return Promise.reject();

  return createdGame;
};

export const updateGame = async (gameId: string, data: UpdateGameData) => {
  const game = await getDocument(collections.games, gameId);

  if (!game) return Promise.reject(`Game not found: ${gameId}`);

  return await updateDocument(collections.games, gameId, {
    ...data,
    duration: calculateDuration(game),
  });
};

export const getGamesForGroup = async (userId: string, groupId: string) => {
  const membership = await getDocuments({
    collection: collections.memberships,
    constraints: [
      where("userId", "==", userId),
      where("groupId", "==", groupId),
    ],
  });

  if (membership.length === 0)
    return Promise.reject(`User is not a member of the group: ${groupId}`);

  const games = await getDocuments({
    collection: collections.games,
    constraints: [where("groupId", "==", groupId)],
  });

  games.map((game) => (game.duration = calculateDuration(game)));

  return games;
};

export const getGameById = async (userId: string, gameId: string) => {
  const game = await getDocument(collections.games, gameId);
  if (!game) return Promise.reject(`Spill med id '${gameId}' finnes ikke`);

  const membership = await getDocuments({
    collection: collections.memberships,
    constraints: [
      where("userId", "==", userId),
      where("groupId", "==", game.groupId),
    ],
  });

  if (membership.length === 0)
    return Promise.reject(`Du har ikke tilgang til spillet`);

  game.duration = calculateDuration(game);
  return game;
};
