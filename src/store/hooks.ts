import { useEffect } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./store";
import { DataStatus } from "./store.types";
import { getAllGamesAction } from "./game.reducer";
import { getAllGroupsAction } from "./groupsInternal.reducer";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;

export const useGetGroupsForCurrentUser = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups);

  const user = { id: "123" };

  useEffect(() => {
    if (user && !groups.data && groups.status !== DataStatus.LOADING) {
      dispatch(getAllGroupsAction(user.id));
    }
  });

  return groups;
};

export const useGetGamesForGroup = (groupId: string) => {
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.games);

  useEffect(() => {
    if (!games.data! && games.status !== DataStatus.LOADING) {
      dispatch(getAllGamesAction(groupId));
    }
  });

  return {
    ...games,
    data: games.data?.filter((g) => g.groupId === groupId),
  };
};
