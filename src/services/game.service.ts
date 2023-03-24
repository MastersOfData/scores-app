import { Timestamp, where } from "firebase/firestore";
import {
  addDocument,
  gamesCol,
  getDocument,
  getDocuments,
  membershipsCol,
  updateDocument,
} from "src/fire-base/db";
import { Game, Membership } from "src/fire-base/models";
import { calculateDuration } from "src/utils/util";

export interface CreateGameData {
  groupId: string;
  gameTypeId: string;
  allowTeams: boolean;
  participants: string[];
}

export type UpdateGameData = Pick<Game, "winner" | "status">;

export const createGame = async (data: CreateGameData) => {
  const user = {
    id: "",
  }; // TODO fetch user from context or pass a prop

  const players = data.participants.map((participantId) => ({
    playerId: participantId,
    points: 0,
  }));

  const game: Game = {
    ...data,
    adminId: user.id,
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

  return await updateDocument<Game>(gamesCol, gameId, {
    ...data,
    duration: calculateDuration(game),
  });
};

export const getGamesForGroup = async (groupId: string) => {
  const user = {
    id: "",
  }; // TODO fetch from context or pass as prop
  
  const membership = await getDocuments<Membership>({
    collectionId: membershipsCol,
    constraints: [where("userId", "==", user.id), where("groupId", "==", groupId)],
  })

  if (membership.length === 0) return Promise.reject();

  const games = await getDocuments<Game>({
    collectionId: gamesCol,
    constraints: [where("groupId", "==", groupId)],
  });

  games.map((game) => (game.duration = calculateDuration(game)));

  return games;
};
