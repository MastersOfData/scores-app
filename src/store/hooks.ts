import { useEffect } from "react";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./store";
import { DataStatus } from "./store.types";
import { getAllGroupsAction } from "./groupsInternal.reducer";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;

export const useGetGroupsForCurrentUser = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groupsInternal);

  const user = { id: "123" };

  useEffect(() => {
    if (user && !groups.data && groups.status !== DataStatus.LOADING) {
      dispatch(getAllGroupsAction(user.id));
    }
  });

  return groups;
};
