import { documentId, where } from "firebase/firestore";
import {
  addDocument,
  getDocument,
  getDocuments,
  groupsCol,
  setDocument,
  userGroupStatisticsCol,
} from "src/fire-base/db";
import { Group, UserGroupStatistic } from "src/fire-base/models";
import { generateUserGroupStatisticDocumentId } from "src/utils/util";

export const createGroup = async (
  currentUserId: string,
  groupName: string,
  emoji: string
) => {
  const group: Group = {
    name: groupName,
    emoji: emoji,
    games: [],
    invitationCode: "", // TODO: Generate invite code
  };
  const groupRef = await addDocument(groupsCol, group);
  const createdGroup = await getDocument<Group>(groupsCol, groupRef.id);

  if (!createdGroup) return Promise.reject();

  await joinGroup(createdGroup.id, currentUserId);
  return createdGroup;
};

export const getGroupsForCurrentUser = async (userId: string) => {
  const groupIds = await getDocuments<UserGroupStatistic>({
    collectionId: userGroupStatisticsCol,
    constraints: [where("userId", "==", userId)],
  }).then((groups) => [...new Set(groups.map((group) => group.groupId))]);

  const groups =
    groupIds.length > 0
      ? await getDocuments<Group>({
          collectionId: groupsCol,
          constraints: [where(documentId(), "in", groupIds)],
        }).then((res) => res)
      : [];

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
  };

  await setDocument(userGroupStatisticsCol, docId, userGroupStatistic);

  return await getDocument<Group>(groupsCol, docId);
};
