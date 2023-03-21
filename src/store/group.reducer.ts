import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Group } from "../fire-base/models";
import {
  createGroup,
  getGroupsForCurrentUser,
  joinGroup,
} from "../services/group.service";
import { WithId } from "../types/types";
import { DataStatus, DataWithStatus } from "./store.types";

type GroupState = DataWithStatus<WithId<Group>[]>;

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

export const getUsersGroupsAction = createAsyncThunk(
  "groups/getAll",
  async (userId: string) => {
    const res = await getGroupsForCurrentUser(userId);
    console.log("result: ", res);
    return res;
  }
);

export const createGroupAction = createAsyncThunk(
  "groups/create",
  async ({
    currentUserId,
    groupName,
    groupEmoji,
  }: {
    currentUserId: string;
    groupName: string;
    groupEmoji: string;
  }) => {
    const res = await createGroup(currentUserId, groupName, groupEmoji);
    return res;
  }
);

export const joinGroupAction = createAsyncThunk(
  "groups/join",
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    const res = await joinGroup(groupId, userId);
    return res;
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersGroupsAction.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getUsersGroupsAction.fulfilled, (state, action) => {
        state.status = DataStatus.COMPLETED;
        state.data = action.payload.map((x) => x);
      })
      .addCase(getUsersGroupsAction.rejected, (state) => {
        state.status = DataStatus.ERROR;
        state.data = [];
      })
      .addCase(createGroupAction.pending, (state) => {
        state.create.status = DataStatus.LOADING;
      })
      .addCase(createGroupAction.fulfilled, (state, action) => {
        state.create.status = DataStatus.COMPLETED;
        state.data = state.data?.concat(action.payload);
      })
      .addCase(createGroupAction.rejected, (state) => {
        state.create.status = DataStatus.ERROR;
      })
      .addCase(joinGroupAction.pending, (state, action) => {
        state.update.status = DataStatus.LOADING;
        state.update.dataId = action.meta.arg.groupId;
      })
      .addCase(joinGroupAction.fulfilled, (state, action) => {
        state.update.status = DataStatus.COMPLETED;
        state.update.dataId = undefined;
        if (action.payload) {
          state.data = state.data?.concat(action.payload);
        }
      })
      .addCase(joinGroupAction.rejected, (state) => {
        state.update.status = DataStatus.ERROR;
      });
  },
});

export const groupsReducer = groupsSlice.reducer;
