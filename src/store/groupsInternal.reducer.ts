import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGroupsInternalForCurrentUser } from "../services/group.service";
import { GroupInternal } from "../types/types";
import { DataStatus, DataWithStatus } from "./store.types";

type GroupsInternalState = DataWithStatus<GroupInternal[]>;

const initialState: GroupsInternalState = {
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

export const getAllGroupsAction = createAsyncThunk(
  "groupsInternal/getAll",
  async (userId: string) => {
    const res = await getGroupsInternalForCurrentUser(userId);
    return res;
  }
);

const groupsInternalSlice = createSlice({
  name: "groupsInternal",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroupsAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getAllGroupsAction.fulfilled, (state, action) => {
        state.status = DataStatus.COMPLETED;
        state.data = action.payload;
      })
      .addCase(getAllGroupsAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.data = [];
      });
  },
});

export const groupsInternalReducer = groupsInternalSlice.reducer;
