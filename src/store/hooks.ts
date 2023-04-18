import { useEffect, useState } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./store";
import { DataStatus } from "./store.types";
import { getAllGamesAction, getGameByIdAction } from "./game.reducer";
import { getAllGroupsAction } from "./groupsInternal.reducer";
import { useUser } from "src/services/user.service";
import {
  addDocument,
  Document,
  gameActionsCol,
  gamesCol,
  subscribeToDocument,
  subscribeToDocuments,
} from "../fire-base/db";
import { Game, GameAction } from "../fire-base/models";
import { UserAccess, GameActionType } from "../types/types";
import { Timestamp, where } from "firebase/firestore";
import { userHasAccessToGame } from "../services/game.service";
import { calculateElapsedGameTime } from "../utils/util";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;

export const useGetGroupsForCurrentUser = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups);

  const { user, loading } = useUser();

  useEffect(() => {
    if (
      (!loading && groups.data === null && user) ||
      (!loading &&
        groups.data === undefined &&
        groups.status !== DataStatus.LOADING)
    ) {
      dispatch(getAllGroupsAction(user?.uid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, groups, loading]);

  return groups;
};

export const useGetGamesForGroup = (groupId: string) => {
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.games);
  const { user } = useUser();

  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    if (user && !hasFetchedData && games.status !== DataStatus.LOADING) {
      dispatch(getAllGamesAction({ userId: user.uid, groupId: groupId }))
        .unwrap()
        .then(() => setHasFetchedData(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, games]);

  return {
    ...games,
    data: games.data?.filter((g) => g.groupId === groupId),
  };
};

export const useGetGameById = (gameId: string) => {
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.games);
  const { user } = useUser();

  useEffect(() => {
    if (
      user &&
      !games.data?.find((g) => g.id === gameId) &&
      games.status !== DataStatus.LOADING &&
      games.status !== DataStatus.ERROR
    ) {
      dispatch(getGameByIdAction({ userId: user.uid, gameId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, games]);

  return {
    ...games,
    data: games.data?.find((g) => g.id === gameId),
  };
};

export const useUserHasAccessToGame = (gameId: string) => {
  const { user } = useUser();
  const [userAccess, setUserAccess] = useState<
    UserAccess & { hasLoaded: boolean }
  >({ hasAccess: false, hasLoaded: false });

  useEffect(() => {
    user
      ? userHasAccessToGame(user?.uid, gameId).then((data) =>
          setUserAccess({
            ...data,
            hasLoaded: true,
          })
        )
      : setUserAccess({ hasAccess: false, hasLoaded: false });
  }, [user, gameId]);

  return userAccess;
};

export const useGetLiveGame = (gameId: string) => {
  const { user } = useUser();

  const [localGameState, setLocalGameState] = useState<Document<Game> | null>(
    null
  );
  const [localGameLog, setLocalGameLog] = useState<Document<GameAction>[]>([]);
  const [elapsedGameTime, setElapsedGameTime] = useState(0);

  useEffect(() => {
    return subscribeToDocument<Game>(gamesCol, gameId, setLocalGameState);
  }, [gameId]);

  useEffect(() => {
    return subscribeToDocuments<GameAction>(
      {
        collectionId: gameActionsCol,
        constraints: [where("gameId", "==", gameId)],
      },
      setLocalGameLog
    );
  }, [gameId]);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = calculateElapsedGameTime(localGameLog);
      setElapsedGameTime(elapsed);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [localGameLog]);

  const addPoints = async (userId: string, points: number) => {
    if (user) {
      await addDocument<GameAction>(gameActionsCol, {
        subjectId: userId,
        value: points,
        actionType: GameActionType.ADD_POINTS,
        gameId,
        actorId: user.uid,
        timestamp: Timestamp.now(),
      });
    }
  };

  const changeGameStatus = async (status: GameActionType) => {
    if (user) {
      await addDocument<GameAction>(gameActionsCol, {
        actionType: status,
        gameId,
        actorId: user.uid,
        timestamp: Timestamp.now(),
      });
    }
  };

  return {
    localGameState,
    localGameLog,
    addPoints,
    changeGameStatus,
    elapsedGameTime,
  };
};
