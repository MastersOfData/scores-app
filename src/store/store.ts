import { configureStore } from "@reduxjs/toolkit";
import { groupsReducer } from "./group.reducer";
import { groupsInternalReducer } from "./groupsInternal.reducer";

export const store = configureStore({
  reducer: {
    groups: groupsReducer,
    groupsInternal: groupsInternalReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type StoreType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
