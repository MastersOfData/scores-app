import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Game } from "src/fire-base/models";
import {
  createGame,
  CreateGameData,
  getGamesForGroup,
  updateGame,
  UpdateGameData,
} from "src/services/game.service";
import { WithId } from "src/types/types";
import { DataStatus, DataWithStatus } from "./store.types";

type GameState = DataWithStatus<WithId<Game>[]>;

const initialState: GameState = {
  data: undefined,
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

export const getAllGamesAction = createAsyncThunk(
  "games/getAll",
  async (groupId: string) => {
    const res = await getGamesForGroup(groupId);
    return res;
  }
);

export const updateGameAction = createAsyncThunk(
  "games/update",
  async ({
    gameId,
    gameData,
  }: {
    gameId: string;
    gameData: UpdateGameData;
  }) => {
    await updateGame(gameId, gameData);
    return gameId;
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create game
      .addCase(createGameAction.pending, (state) => {
        state.create.status = DataStatus.LOADING;
      })
      .addCase(createGameAction.fulfilled, (state, action) => {
        state.create.status = DataStatus.COMPLETED;
        const index = state.data?.findIndex((g) => g.id === action.payload.id);

        if (state.data && index === -1) {
          state.data = [...state.data, action.payload];
        } else {
          state.data = [action.payload];
        }
      })
      .addCase(createGameAction.rejected, (state) => {
        state.create.status = DataStatus.ERROR;
      })
      // Get games
      .addCase(getAllGamesAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getAllGamesAction.fulfilled, (state, action) => {
        state.status = DataStatus.COMPLETED;
        const newGames = action.payload.filter(
          (game) => state.data?.findIndex((g) => g.id === game.id) === -1
        );

        if (state.data) {
          state.data = [...state.data, ...newGames];
        } else {
          state.data = action.payload;
        }
      })
      .addCase(getAllGamesAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.data = [];
      })
      // Update game
      .addCase(updateGameAction.pending, (state, action) => {
        state.update.status = DataStatus.LOADING;
        state.update.dataId = action.meta.arg.gameId;
      })
      .addCase(updateGameAction.fulfilled, (state, action) => {
        const gameId = action.meta.arg.gameId;

        state.update.status = DataStatus.COMPLETED;
        state.update.dataId = undefined;

        if (state.data) {
          const gameIndex = state.data.findIndex((g) => g.id === gameId);
          if (gameIndex > -1) {
            state.data[gameIndex] = Object.assign(
              state.data[gameIndex],
              action.meta.arg.gameData
            );
          }
        } else {
          throw Error(
            "Called for game update, but game doesn't exist: " +
              action.meta.arg.gameId
          );
        }
      })
      .addCase(updateGameAction.rejected, (state) => {
        state.update.status = DataStatus.ERROR;
      });
  },
});

export const gamesReducer = gamesSlice.reducer;
