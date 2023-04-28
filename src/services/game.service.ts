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
import { GameActionType, UserAccess } from "../types/types";

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

export type UpdateGameData = Pick<Game, "winners" | "status">;

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
    players: [...players],
    timestamp: Timestamp.fromDate(new Date()),
    status: "NOT_STARTED",
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

export type GroupData = Pick<Document<Group>, "id" | "name" | "emoji">;

export type GameActionData = Pick<
  Document<GameAction>,
  "id" | "actionType" | "value"
> & {
  timestamp: Date;
  actor: Document<User> | null;
  subject: Document<User> | null;
};

export type PlayerData = Document<User> & {
  points: number;
};

export type GameData = Pick<Document<Game>, "id" | "duration" | "status"> & {
  gameType: string;
  timestamp: Date;
  group: GroupData | null;
  gameActions: GameActionData[];
  admin: Document<User> | null;
  players: PlayerData[];
  winners: PlayerData[];
};

export type GameDataResult = {
  game: GameData | null;
  loading: boolean;
  error: boolean;
};

export function useGameData(gameId: Document<Game>["id"]): GameDataResult {
  //const { hasAccess, hasLoaded } = useUserHasAccessToGame(gameId)

  const [game, setGame] = useState<Document<Game> | null>(null);
  const [group, setGroup] = useState<Document<Group> | null>(null);
  const [gameActions, setGameActions] = useState<Document<GameAction>[]>([]);
  const [players, setPlayers] = useState<Document<User>[]>([]);
  const [admin, setAdmin] = useState<Document<User> | null>(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [gameActionsLoading, setGameActionsLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (/*hasLoaded && hasAccess*/ true) {
      getDocument(collections.games, gameId).then(setGame);
    }
  }, [gameId /*hasLoaded, hasAccess*/]);

  useEffect(() => {
    if (game) {
      getDocument(collections.groups, game.groupId)
        .then(setGroup)
        .then(() => setGroupLoading(false));
    }
  }, [game]);

  useEffect(() => {
    if (game) {
      getDocument(collections.users, game.adminId)
        .then(setAdmin)
        .then(() => setAdminLoading(false));
    }
  }, [game]);

  useEffect(() => {
    if (game) {
      Promise.all(
        game.players.map((p) => getDocument(collections.users, p.playerId))
      )
        .then((_players) => _players.filter((p) => !!p).map((p) => p!))
        .then(setPlayers)
        .then(() => setPlayersLoading(false));
    }
  }, [game]);

  useEffect(() => {
    if (game) {
      getDocuments({
        collection: collections.gameActions,
        constraints: [where("gameId", "==", game.id)],
      })
        .then(setGameActions)
        .then(() => setGameActionsLoading(false));
    }
  }, [game]);

  const playersData: PlayerData[] = players.map((p) => {
    const points = gameActions
      .filter(
        (a) =>
          a.actionType === GameActionType.ADD_POINTS && a.subjectId === p.id
      )
      .map((a) => a.value ?? 0)
      .reduce((sum, value) => sum + value, 0);

    return {
      id: p.id,
      email: p.email,
      username: p.username,
      points,
    };
  });

  const winnersData: PlayerData[] = playersData.filter((p) => {
    const max = Math.max(...playersData.map((p) => p.points));
    return p.points === max;
  });

  const groupData: GroupData | null = !group
    ? null
    : {
        id: group.id,
        name: group.name,
        emoji: group.emoji,
      };

  const actionsData: GameActionData[] = gameActions.map((a) => {
    const actor = players.find((p) => p.id === a.actorId) ?? null;
    const subject = players.find((p) => p.id === a.subjectId) ?? null;
    return {
      actor,
      subject,
      actionType: a.actionType,
      id: a.id,
      timestamp: a.timestamp.toDate(),
      value: a.value,
    };
  });

  const gameData: GameData | null = !game
    ? null
    : {
        id: game.id,
        timestamp: game.timestamp.toDate(),
        duration: game.duration,
        gameType: game.gameTypeId,
        status: game.status,
        admin,
        players: playersData,
        winners: winnersData,
        group: groupData,
        gameActions: actionsData,
      };

  const loading =
    groupLoading || playersLoading || gameActionsLoading || adminLoading;

  return {
    game: loading ? null : gameData,
    loading,
    error: !gameData && !loading,
  };
}
