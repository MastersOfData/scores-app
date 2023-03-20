import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { where } from "firebase/firestore";
import { getDocuments } from "../fire-base/db";
import { Group } from "../fire-base/models";
import { DataStatus, DataWithStatus } from "./storeTypes";

type GroupState = DataWithStatus<Group[]>;

const initialState: GroupState = {
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

export const getUsersGroups = createAsyncThunk(
  "groups/getAll",
  async (userId: string) => {
    const res = await getDocuments<Group>({
      collectionId: "user_group_statistics",
      constraints: [where("userId", "==", userId)],
    });
    console.log("result: ", res);
    return res;
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersGroups.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getUsersGroups.fulfilled, (state, action) => {
        state.status = DataStatus.COMPLETED;
        state.data = action.payload;
      })
      .addCase(getUsersGroups.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.data = [];
      });
  },
});

export const groupsReducer = groupsSlice.reducer;
