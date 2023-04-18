import { useEffect, useState } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./store";
import { DataStatus } from "./store.types";
import { getAllGamesAction, getGameByIdAction } from "./game.reducer";
import { getAllGroupsAction } from "./groupsInternal.reducer";
import { useUser } from "src/services/user.service";

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
