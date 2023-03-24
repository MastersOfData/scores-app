import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Game } from "src/fire-base/models";
import {
  createGame,
  CreateGameData,
  getGamesForGroup,
} from "src/services/game.service";
import { WithId } from "src/types/types";
import { DataStatus, DataWithStatus } from "./store.types";

type GameState = DataWithStatus<Record<string, (WithId<Game>)[]>>;

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
  "games/create",
  async ({ gameData }: { gameData: CreateGameData }) => {
    const res = await createGame(gameData);
    return res;
  }
);

export const getGroupsGamesAction = createAsyncThunk(
  "games/get",
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
        const groupId = action.payload.groupId;
        state.status = DataStatus.COMPLETED;

        if (state.data) {
          state.data[groupId] = [...state.data[groupId], action.payload];
        } else {
          state.data = { [groupId]: [action.payload] };
        }
      })
      .addCase(createGameAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
      })
      .addCase(getGroupsGamesAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getGroupsGamesAction.fulfilled, (state, action) => {
        const groupId = action.meta.arg;
        state.status = DataStatus.COMPLETED;

        if (state.data) {
          state.data[groupId] = state.data[groupId].concat(action.payload);
        } else {
          state.data = { [groupId]: action.payload };
        }
      })
      .addCase(getGroupsGamesAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
      });
  },
});

export const gamesReducer = gamesSlice.reducer;
