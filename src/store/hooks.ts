import { useEffect } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { getGamesForCurrentUser, getGamesForGroup } from "src/services/game.service";
import { getUsersGroupsAction } from "./group.reducer";
import { AppDispatch, StoreType } from "./store";
import { DataStatus } from "./store.types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;

export const useGetGroupsForCurrentUser = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups);
  const user = { id: "123" }; // TODO: useAppSelector(state => state.user)

  useEffect(() => {
    if (user && !groups.data && groups.status !== DataStatus.LOADING) {
      dispatch(getUsersGroupsAction(user.id));
    }
  });

  return groups;
};

export const useGetGamesForCurrentUser = () => {
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.games);
  const user = { id: "123" }; // TODO: userAppSelector(state => state.user)

  useEffect(() => {
    if (user && !games.data?[user.id] && games.status !== DataStatus.LOADING) {
      dispatch(getGamesForCurrentUser(user.id));
    }
  })

  return games;
}

export const useGetGamesForGroup = (groupId: string) => {
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.games);

  useEffect(() => {
    if (!games.data?[groupId] && games.status !== DataStatus.LOADING) {
      dispatch(getGamesForGroup(groupId);
    }
  })
}