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
import { useCurrentUser } from "./user.service";

export interface CreateGameData {
  groupId: string;
  gameTypeId: string;
  allowTeams: boolean;
  participants: string[];
}

export type UpdateGameData = Pick<Game, "winner" | "status">;

export const createGame = async (data: CreateGameData) => {
  const user = useCurrentUser();

  if (!user) return Promise.reject("User is not logged in");

  const players = data.participants.map((participantId) => ({
    playerId: participantId,
    points: 0,
  }));

  const game: Game = {
    groupId: data.groupId,
    gameTypeId: data.gameTypeId,
    allowTeams: data.allowTeams,
    adminId: user.uid,
    players: [...players, { playerId: user.uid, points: 0 }],
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

  if (!game) return Promise.reject(`Game not found: ${gameId}`);

  return await updateDocument<Game>(gamesCol, gameId, {
    ...data,
    duration: calculateDuration(game),
  });
};

export const getGamesForGroup = async (groupId: string) => {
  const user = useCurrentUser();

  if (!user) return Promise.reject("User is not logged in.");

  const membership = await getDocuments<Membership>({
    collectionId: membershipsCol,
    constraints: [
      where("userId", "==", user.uid),
      where("groupId", "==", groupId),
    ],
  });

  if (membership.length === 0) return Promise.reject(`User is not a member of the group: ${groupId}`);

  const games = await getDocuments<Game>({
    collectionId: gamesCol,
    constraints: [where("groupId", "==", groupId)],
  });

  games.map((game) => (game.duration = calculateDuration(game)));

  return games;
};
