import { useEffect } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
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
