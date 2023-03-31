import { documentId, where } from "firebase/firestore";
import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  groupsCol,
  setDocument,
  updateDocument,
  membershipsCol,
  usersCol,
} from "src/fire-base/db";
import { Group, User, Membership } from "src/fire-base/models";
import { generateMembershipDocumentId } from "src/utils/util";
import { GroupInternal } from "../types/types";
import { mapGroupAndUsersToGroupInternal } from "../utils/mappers";
import { createPincode } from "./pin.service";

export const getGroupsForCurrentUser = async (userId: string) => {
  const groupIds = await getDocuments<Membership>({
    collectionId: membershipsCol,
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

const joinGroup = async (groupId: string, userId: string) => {
  const docId = generateMembershipDocumentId(userId, groupId);

  const userGroupStatistic: Membership = {
    userId: userId,
    groupId: groupId,
    wins: 0,
    draws: 0,
    losses: 0,
  };

  await setDocument(membershipsCol, docId, userGroupStatistic);

  return await getDocument<Group>(groupsCol, docId);
};

export const createGroup = async (
  currentUserId: string,
  groupName: string,
  emoji: string
) => {
  const invitationCode = await createPincode();

  const group: Group = {
    name: groupName,
    emoji: emoji,
    games: [],
    invitationCode: invitationCode,
    gameTypes: [],
  };
  const groupRef = await addDocument(groupsCol, group);

  await joinGroup(groupRef.id, currentUserId);
  return getGroupInternal(groupRef.id);
};

export const joinGroupByInvitationCode = async (
  invitationCode: string,
  userId: string
) => {
  const groupArray = await getDocuments<Group>({
    collectionId: groupsCol,
    constraints: [where("invitationCode", "==", invitationCode)],
  });

  if (groupArray.length === 0 || groupArray.length > 1) return Promise.reject();

  const membership = await getDocuments<Membership>({
    collectionId: membershipsCol,
    constraints: [
      where("userId", "==", userId),
      where("groupId", "==", groupArray[0].id),
    ],
  });

  const userIsAlreadyMember = membership.length > 0;
  if (userIsAlreadyMember)
    return Promise.reject("User is already a member of the group");

  const groupId = groupArray[0].id;
  const docId = generateMembershipDocumentId(userId, groupId);

  const userGroupStatistic: Membership = {
    userId: userId,
    groupId: groupId,
    wins: 0,
    draws: 0,
    losses: 0,
  };

  await setDocument(membershipsCol, docId, userGroupStatistic);

  return await getGroupInternal(groupId);
};

export const removeUserFromGroup = async (userId: string, groupId: string) => {
  const statsId = generateMembershipDocumentId(userId, groupId);
  await deleteDocument(membershipsCol, statsId);
};

export const getStatsForAllUsersInGroup = async (groupId: string) => {
  return await getDocuments<Membership>({
    collectionId: membershipsCol,
    constraints: [where("groupId", "==", groupId)],
  }).then((res) => res);
};

export const getGroupInternal = async (groupId: string) => {
  const group = await getDocument<Group>(groupsCol, groupId);
  if (!group) return Promise.reject();

  const stats = await getStatsForAllUsersInGroup(groupId);
  const users = await getDocuments<User>({
    collectionId: usersCol,
    constraints: [
      where(
        documentId(),
        "in",
        stats.map((s) => s.userId)
      ),
    ],
  });

  return mapGroupAndUsersToGroupInternal(group, stats, users);
};

export const getGroupsInternalForCurrentUser = async (userId: string) => {
  const groups = await getGroupsForCurrentUser(userId);

  const groupsInternalPromises: Promise<GroupInternal>[] = [];

  groups.forEach(async (group) => {
    groupsInternalPromises.push(
      new Promise(async (resolve, reject) => {
        try {
          const stats = await getStatsForAllUsersInGroup(group.id);
          const users = await getDocuments<User>({
            collectionId: usersCol,
            constraints: [
              where(
                documentId(),
                "in",
                stats.map((s) => s.userId)
              ),
            ],
          });
          const mappedGroups = mapGroupAndUsersToGroupInternal(
            group,
            stats,
            users
          );
          resolve(mappedGroups);
        } catch (err) {
          reject(err);
        }
      })
    );
  });

  return Promise.all(groupsInternalPromises).then((data) => data);
};

export const createGameTypeForGroup = async (
  groupId: string,
  gameTypeName: string,
  gameTypeEmoji: string
) => {
  const group = await getDocument<Group>(groupsCol, groupId);
  if (!group) return Promise.reject();

  const nextId =
    group.gameTypes && group.gameTypes.length > 0
      ? group.gameTypes.map((gt) => Number(gt.id)).sort()[
          group.gameTypes.length - 1
        ] + 1
      : 1;

  const gameType = {
    id: nextId.toString(),
    name: gameTypeName,
    emoji: gameTypeEmoji,
  };

  const updatedGroup: Group = {
    ...group,
    gameTypes: group.gameTypes?.concat([gameType]),
  };

  await updateDocument<Group>(groupsCol, groupId, updatedGroup);
  return gameType;
};
