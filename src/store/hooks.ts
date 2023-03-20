import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;
