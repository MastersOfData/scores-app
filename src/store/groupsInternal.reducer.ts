import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createGroupNew,
  getGroupsInternalForCurrentUser,
  joinGroupByInvitationCode,
  removeUserFromGroup,
} from "../services/group.service";
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

export const joinGroupByInvitationCodeAction = createAsyncThunk(
  "groupsInternal/joinGroup",
  async ({
    invitationCode,
    userId,
  }: {
    invitationCode: string;
    userId: string;
  }) => {
    return await joinGroupByInvitationCode(invitationCode, userId);
  }
);

export const createGroupAction = createAsyncThunk(
  "groupsInternal/createGroup",
  async ({
    currentUserId,
    groupName,
    groupEmoji,
  }: {
    currentUserId: string;
    groupName: string;
    groupEmoji: string;
  }) => {
    const res = await createGroupNew(currentUserId, groupName, groupEmoji);
    return res;
  }
);

export const removeUserFromGroupAction = createAsyncThunk(
  "groupsInternal/removeUser",
  async ({ userId, groupId }: { userId: string; groupId: string }) => {
    await removeUserFromGroup(userId, groupId);
    return {
      userId,
      groupId,
    };
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
      })
      .addCase(joinGroupByInvitationCodeAction.pending, (state) => {
        state.update.status = DataStatus.LOADING;
      })
      .addCase(joinGroupByInvitationCodeAction.fulfilled, (state, action) => {
        state.update.status = DataStatus.COMPLETED;
        if (state.data) state.data.push(action.payload);
        else state.data = [action.payload];
      })
      .addCase(joinGroupByInvitationCodeAction.rejected, (state) => {
        state.update.status = DataStatus.ERROR;
      })
      .addCase(createGroupAction.pending, (state) => {
        state.create.status = DataStatus.LOADING;
      })
      .addCase(createGroupAction.fulfilled, (state, action) => {
        state.create.status = DataStatus.COMPLETED;
        if (state.data) state.data.push(action.payload);
        else state.data = [action.payload];
      })
      .addCase(createGroupAction.rejected, (state) => {
        state.create.status = DataStatus.ERROR;
      })
      .addCase(removeUserFromGroupAction.pending, (state, action) => {
        state.update.status = DataStatus.LOADING;
        state.update.dataId = action.meta.arg.groupId;
      })
      .addCase(removeUserFromGroupAction.fulfilled, (state, action) => {
        state.update.status = DataStatus.COMPLETED;
        state.update.dataId = undefined;
        state.data?.forEach((group) => {
          group.id === action.payload.groupId
            ? group.members.filter(
                (member) => member?.id === action.payload.userId
              )
            : group;
        });
      })
      .addCase(removeUserFromGroupAction.rejected, (state) => {
        state.update.status = DataStatus.ERROR;
      });
  },
});

export const groupsInternalReducer = groupsInternalSlice.reducer;
