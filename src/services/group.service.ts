import { where } from "firebase/firestore";
import {
  addDocument,
  getDocuments,
  groupsCol,
  setDocument,
  userGroupStatisticsCol,
} from "src/fire-base/db";
import { Group, UserGroupStatistic } from "src/fire-base/models";
import { generateUserGroupStatisticDocumentId } from "src/utils/util";

export const createGroup = async (groupName: string, emoji: string) => {
  const group: Group = {
    name: groupName,
    emoji: emoji,
    games: [],
    invitationCode: "" // TODO: Generate invite code
  };
  await addDocument(groupsCol, group)
}

export const getGroupsForCurrentUser = async (userId: string) => {
  const groupIds = await getDocuments<UserGroupStatistic>({
    collectionId: userGroupStatisticsCol,
    constraints: [where("id", "<=", userId)], 
  }).then((groups) => [...new Set(groups.map((group) => group.groupId))]);

  const groups = await getDocuments<Group>({
    collectionId: groupsCol,
    constraints: [where("id", "in", groupIds)],
  }).then((res) => res);

  return groups;
};

export const joinGroup = async (groupId: string, userId: string) => {
  const docId = generateUserGroupStatisticDocumentId(userId, groupId);

  const userGroupStatistic: UserGroupStatistic = {
    userId: userId,
    groupId: groupId,
    wins: 0,
    draws: 0,
    losses: 0,
  }

  await setDocument(userGroupStatisticsCol, docId, userGroupStatistic);
}