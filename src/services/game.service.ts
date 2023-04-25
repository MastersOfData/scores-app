import { Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  addDocument,
  collections,
  Document,
  getDocument,
  getDocuments,
  updateDocument,
} from "src/fire-base/db";
import { Game, GameAction, Group, User } from "src/fire-base/models";
import { calculateDuration } from "src/utils/util";
import { UserAccess } from "../types/types";

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

export const userHasAccessToGame = async (
  userId: string,
  gameId: string
): Promise<UserAccess> => {
  const game = await getDocument(collections.games, gameId);
  if (!game)
    return {
      hasAccess: false,
      noAccessReason: `Spill med id '${gameId}' finnes ikke`,
    };

  const membership = await getDocuments({
    collection: collections.memberships,
    constraints: [
      where("userId", "==", userId),
      where("groupId", "==", game.groupId),
    ],
  });

  if (membership.length === 0)
    return {
      hasAccess: false,
      noAccessReason: `Du har ikke tilgang til spillet`,
    };

  return {
    hasAccess: true,
  };
};

export function useGetGameByIdWithAggregateData(gameId: Document<Game>["id"]) {
  const [game, setGame] = useState<Document<Game> | null>(null)
  const [group, setGroup] = useState<Document<Group> | null>(null)
  const [gameActions, setGameActions] = useState<Document<GameAction>[]>([])
  const [players, setPlayers] = useState<Document<User>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocument(collections.games, gameId)
      .then(_game => {
        setGame(_game)
        if (_game) {
          const groupFetcher = getDocument(collections.groups, _game.groupId).then(setGroup)

          const gameActionsFetcher = getDocuments({
            collection: collections.gameActions,
            constraints: [where("gameId", "==", _game.id)]
          })
          .then(setGameActions)

          const playersFetcher = Promise.all(
            _game.players.map(p => getDocument(collections.users, p.playerId))
          )
          .then(_players => _players.filter(p => !!p) as Document<User>[]).then(setPlayers)

          Promise.all([groupFetcher, gameActionsFetcher, playersFetcher])
        }
      })
      .then(() => setLoading(false))
  }, [gameId])

  if (!game && loading) return {
    game: null,
    loading: true
  }

  return {
    game: {
      ...game,
      group,
      gameActions: gameActions.sort((a1, a2) => a1.timestamp.valueOf().localeCompare(a2.timestamp.valueOf())),
      players
    },
    loading: false
  }
}
