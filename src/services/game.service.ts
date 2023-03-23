import { group } from "console";
import { documentId, Timestamp, where } from "firebase/firestore";
import {
  addDocument,
  gamesCol,
  getDocument,
  getDocuments,
  groupsCol,
  usersCol,
} from "src/fire-base/db";
import { Game, User } from "src/fire-base/models";
import { useLocalStorage } from "src/hooks/hooks";
import { mapGameToInternal } from "src/utils/mappers";

export interface CreateGameData {
  groupId?: string;
  gameTypeId: string;
  allowTeams: boolean;
  participants: string[];
}

export const createGame = async (data: CreateGameData) => {
  const authUser: string | undefined = undefined; // TODO fetch user from context

  const players = data.participants.map((participantId) => ({
    playerId: participantId,
    points: 0,
  }));

  const game: Game = {
    ...data,
    adminId: authUser,
    players: players,
    timestamp: Timestamp.fromDate(new Date()),
    state: "ONGOING",
  };

  const gameRef = await addDocument(gamesCol, game);
  const createdGame = await getDocument<Game>(gamesCol, gameRef.id);

  if (!createdGame) return Promise.reject();

  return createdGame;
};

export const getGamesForCurrentUser = async (userId: string) => {
  const games = await getDocuments<Game>({
    collectionId: gamesCol,
    constraints: [where("userId", "==", userId)],
  });

  return games;
};

export const getGamesForGroup = async (groupId: string) => {
  // TODO: Perhaps pass user to ensure user is part of group

  const games = await getDocuments<Game>({
    collectionId: gamesCol,
    constraints: [where("groupId", "==", groupId)],
  });

  return games;
};
