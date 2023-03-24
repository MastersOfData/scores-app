import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Game } from "src/fire-base/models";
import {
  createGame,
  CreateGameData,
  getGamesForCurrentUser,
  getGamesForGroup,
} from "src/services/game.service";
import { DataStatus, DataWithStatus } from "./store.types";

type GameState = DataWithStatus<{ [id: string]: (Game & { id: string })[] }>;

const initialState: GameState = {
  data: {},
  status: DataStatus.COMPLETED,
  create: {
    status: DataStatus.COMPLETED,
  },
  update: {
    status: DataStatus.COMPLETED,
    dataId: undefined,
  },
  delete: {
    status: DataStatus.COMPLETED,
  },
};

export const createGameAction = createAsyncThunk(
  "games/getAll",
  async ({ gameData }: { gameData: CreateGameData }) => {
    const res = await createGame(gameData);
    return res;
  }
);

export const getUsersGamesAction = createAsyncThunk(
  "games/user",
  async (userId: string) => {
    const res = await getGamesForCurrentUser(userId);
    return res;
  }
);

export const getGroupsGamesAction = createAsyncThunk(
  "games/group",
  async (groupId: string) => {
    const res = await getGamesForGroup(groupId);
    return res;
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGameAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(createGameAction.fulfilled, (state, action) => {
        const userId = action.payload.userId;
        state.status = DataStatus.COMPLETED;

        if (state.data) {
          state.data[userId] = [...state.data[userId], action.payload];
        } else {
          state.data = { [action.payload.userId]: [action.payload] };
        }
      })
      .addCase(createGameAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
      })
      .addCase(getUsersGamesAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getUsersGamesAction.fulfilled, (state, action) => {
        const userId = action.meta.arg;

        state.status = DataStatus.COMPLETED;

        if (state.data) {
          state.data[userId] = [...state.data[userId], ...action.payload];
        } else {
          state.data = { [userId]: action.payload }
        }
      })
      .addCase(getUsersGamesAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
      })
      .addCase(getGroupsGamesAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getGroupsGamesAction.fulfilled, (state, action) => {
        const groupId = action.meta.arg;
        state.status = DataStatus.COMPLETED;

        if (state.data) {
          state.data[groupId] = [...state.data[groupId], ...action.payload];
        } else {
          state.data = { [groupId]: action.payload }
        }
      })
      .addCase(getGroupsGamesAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
      });
  },
});

export const gamesReducer = gamesSlice.reducer;
