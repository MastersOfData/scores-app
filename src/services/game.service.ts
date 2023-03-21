import { Timestamp } from "firebase/firestore";
import { addDocument, gamesCol } from "src/fire-base/db";
import { Game } from "src/fire-base/models";
import { useLocalStorage } from "src/hooks/hooks";

interface CreateGameData {
  groupId?: string;
  gameTypeId: string;
  allowTeams: boolean;
  participants: string[];
}

export const createGame = async (data: CreateGameData) => {
  const authUser: string | null = null; // TODO fetch user from context

  const players = data.participants.map((participantId) => ({
    playerId: participantId,
    points: 0,
  }));

  const game: Game = {
    ...data,
    admin: authUser,
    players: players,
    timestamp: Timestamp.fromDate(new Date()),
    state: "ONGOING",
  };

  if (!authUser) {
    return useLocalStorage("localGame", game)[0];
  }

  return await addDocument(gamesCol, game);
};
