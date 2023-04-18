import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Membership } from "../fire-base/models";
import {
  createGameTypeForGroup,
  createGroup,
  getGroupsInternalForCurrentUser,
  joinGroupByInvitationCode,
  removeUserFromGroup,
  updateMultipleMemberships,
} from "../services/group.service";
import { GroupInternal, WithId } from "../types/types";
import { DataStatus, DataWithStatus } from "./store.types";

type GroupsInternalState = DataWithStatus<GroupInternal[] | null>;

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
  "groups/getAll",
  async (userId?: string) => {
    if (!userId) return null;
    const res = await getGroupsInternalForCurrentUser(userId);
    return res;
  }
);

export const joinGroupByInvitationCodeAction = createAsyncThunk(
  "groups/joinGroup",
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
  "groups/createGroup",
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

export const removeUserFromGroupAction = createAsyncThunk(
  "groups/removeUser",
  async ({ userId, groupId }: { userId: string; groupId: string }) => {
    await removeUserFromGroup(userId, groupId);
    return {
      userId,
      groupId,
    };
  }
);

export const createGameTypeAction = createAsyncThunk(
  "groups/newGameType",
  async ({
    gameTypeName,
    gameTypeEmoji,
    groupId,
  }: {
    gameTypeName: string;
    gameTypeEmoji: string;
    groupId: string;
  }) => {
    return await createGameTypeForGroup(groupId, gameTypeName, gameTypeEmoji);
  }
);

export const updateGroupMembershipsAction = createAsyncThunk(
  "groups/update-memberships",
  async ({
    memberships,
    groupId,
  }: {
    memberships: WithId<Membership>[];
    groupId: string;
  }) => {
    const res = await updateMultipleMemberships(memberships, groupId);
    return res;
  }
);

const groups = createSlice({
  name: "groups",
  initialState: initialState,
  reducers: {
    clearGroupState: (state) => (state.data = undefined),
  },
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
        const index = state.data?.findIndex(
          (group) => group.id === action.payload.id
        );

        if (state.data && index === -1)
          state.data = [...state.data, action.payload];
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
        if (state.data) state.data = [...state.data, action.payload];
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

        state.data?.map((group) => {
          if (group.id === action.payload.groupId) {
            const members = group.members.filter(
              (member) => member.userId !== action.meta.arg.userId
            );

            return {
              ...group,
              members,
            };
          }

          return group;
        });
      })
      .addCase(removeUserFromGroupAction.rejected, (state) => {
        state.update.status = DataStatus.ERROR;
      })
      .addCase(createGameTypeAction.pending, (state, action) => {
        state.update.dataId = action.meta.arg.groupId;
        state.update.status = DataStatus.LOADING;
      })
      .addCase(createGameTypeAction.fulfilled, (state, action) => {
        state.update.dataId = undefined;
        state.update.status = DataStatus.COMPLETED;
        state.data = state.data?.map((group) => {
          if (group.id === action.meta.arg.groupId) {
            return {
              ...group,
              gameTypes: group.gameTypes?.concat([action.payload]),
            };
          } else {
            return group;
          }
        });
      })
      .addCase(createGameTypeAction.rejected, (state) => {
        state.update.dataId = undefined;
        state.update.status = DataStatus.ERROR;
      })
      .addCase(updateGroupMembershipsAction.pending, (state, action) => {
        state.update.dataId = action.meta.arg.groupId;
        state.update.status = DataStatus.LOADING;
      })
      .addCase(updateGroupMembershipsAction.fulfilled, (state, action) => {
        state.update.dataId = undefined;
        state.update.status = DataStatus.COMPLETED;

        const updatedMemberships = action.meta.arg.memberships;

        state.data = state.data?.map((group) => {
          if (group.id === action.meta.arg.groupId) {
            // Maps original memberships with the updated ones
            const groupMembers = group.members.map((member) => {
              const updatedMembership = updatedMemberships.find(
                (m) => m.userId === member.userId
              );
              return {
                ...member,
                ...updatedMembership,
              };
            });

            return {
              ...group,
              members: groupMembers,
            };
          } else {
            return group;
          }
        });
      })
      .addCase(updateGroupMembershipsAction.rejected, (state) => {
        state.update.dataId = undefined;
        state.update.status = DataStatus.ERROR;
      });
  },
});

export const groupsReducer = groups.reducer;
export const { clearGroupState } = groups.actions;
