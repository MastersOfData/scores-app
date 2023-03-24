import { Timestamp, where } from "firebase/firestore";
import {
  addDocument,
  gamesCol,
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

export interface UpdateGameData extends Pick<Game, "winner" | "status"> {};

export const createGame = async (data: CreateGameData) => {
  const authUser = ""; // TODO fetch user from context or pass a prop

  const players = data.participants.map((participantId) => ({
    playerId: participantId,
    points: 0,
  }));

  const game: Game = {
    ...data,
    adminId: authUser,
    players: players,
    timestamp: Timestamp.fromDate(new Date()),
    status: "ONGOING",
    duration: 0,
  };

  const gameRef = await addDocument(gamesCol, game);
  const createdGame = await getDocument<Game>(gamesCol, gameRef.id);

  if (!createdGame) return Promise.reject();

  return createdGame;
};

export const updateGame = async (gameId: string, data: UpdateGameData) => {
  const game = await getDocument<Game>(gamesCol, gameId);

  if (!game) return Promise.reject();

  await updateDocument<Game>(gamesCol, gameId, {
    ...data,
    duration: calculateDuration(game),
  });
};

export const getGamesForGroup = async (groupId: string) => {
  const games = await getDocuments<Game>({
    collectionId: gamesCol,
    constraints: [where("groupId", "==", groupId)],
  });

  games.map((game) => (game.duration = calculateDuration(game)));

  return games;
};
