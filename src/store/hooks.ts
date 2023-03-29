import { useEffect, useState } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./store";
import { DataStatus } from "./store.types";
import { getGamesAction } from "./game.reducer";
import { getAllGroupsAction } from "./groupsInternal.reducer";
import { getCurrentUser, onAuthStateChanged } from "../fire-base/auth";
import { User } from "firebase/auth";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;

export const useGetGroupsForCurrentUser = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups);

  const [user, setUser] = useState<User | null>(getCurrentUser());
  onAuthStateChanged((value) => setUser(value));

  useEffect(() => {
    if (user && !groups.data && groups.status !== DataStatus.LOADING) {
      dispatch(getAllGroupsAction(user.uid));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, groups]);

  return groups;
};

export const useGetGamesForGroup = (groupId: string) => {
  const dispatch = useAppDispatch();
  const games = useAppSelector((state) => state.games);

  useEffect(() => {
    if (!games.data![groupId] && games.status !== DataStatus.LOADING) {
      dispatch(getGamesAction(groupId));
    }
  });

  return games.data![groupId];
};
