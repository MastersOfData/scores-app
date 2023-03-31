import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { gamesReducer } from "./game.reducer";
import { groupsReducer } from "./groupsInternal.reducer";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: {
    groups: groupsReducer,
    games: gamesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: customizedMiddleware,
});

export type StoreType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
