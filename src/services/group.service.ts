/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { documentId, where } from "firebase/firestore";
import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
  Document,
  collections,
} from "src/fire-base/db";
import { Group, User, Membership } from "src/fire-base/models";
import { generateMembershipDocumentId } from "src/utils/util";
import { GroupInternal } from "../types/types";
import { mapGroupAndUsersToGroupInternal } from "../utils/mappers";
import { createPincode } from "./pin.service";

export const getGroupsForCurrentUser = async (userId: string) => {
  const groupIds = await getDocuments({
    collection: collections.memberships,
    constraints: [where("userId", "==", userId)],
  }).then((groups) => [...new Set(groups.map((group) => group.groupId))]);

  const groups =
    groupIds.length > 0
      ? await getDocuments({
          collection: collections.groups,
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

  await setDocument(collections.memberships, docId, userGroupStatistic);

  return await getDocument(collections.groups, docId);
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

  const groupRef = await addDocument(collections.groups, group);

  await joinGroup(groupRef.id, currentUserId);
  return getGroupInternal(groupRef.id);
};

export const joinGroupByInvitationCode = async (
  invitationCode: string,
  userId: string
) => {
  const groupArray = await getDocuments<Group>({
    collection: collections.groups,
    constraints: [where("invitationCode", "==", invitationCode)],
  });

  if (groupArray.length === 0 || groupArray.length > 1)
    return Promise.reject(`Gruppe med kode ${invitationCode} finnes ikke.`);

  const membership = await getDocuments<Membership>({
    collection: collections.memberships,
    constraints: [
      where("userId", "==", userId),
      where("groupId", "==", groupArray[0].id),
    ],
  });

  const userIsAlreadyMember = membership.length > 0;
  if (userIsAlreadyMember)
    return Promise.reject("Du er allerede medlem i gruppen");

  const groupId = groupArray[0].id;
  const docId = generateMembershipDocumentId(userId, groupId);

  const userGroupStatistic: Membership = {
    userId: userId,
    groupId: groupId,
    wins: 0,
    draws: 0,
    losses: 0,
  };

  await setDocument(collections.memberships, docId, userGroupStatistic);

  return await getGroupInternal(groupId);
};

export const removeUserFromGroup = async (userId: string, groupId: string) => {
  const statsId = generateMembershipDocumentId(userId, groupId);
  await deleteDocument(collections.memberships, statsId);
};

export const getStatsForAllUsersInGroup = async (groupId: string) => {
  return await getDocuments({
    collection: collections.memberships,
    constraints: [where("groupId", "==", groupId)],
  }).then((res) => res);
};

export const getGroupInternal = async (groupId: string) => {
  const group = await getDocument(collections.groups, groupId);
  if (!group) return Promise.reject();

  const stats = await getStatsForAllUsersInGroup(groupId);
  const users = await getDocuments({
    collection: collections.users,
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
          const users = await getDocuments({
            collection: collections.users,
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
  const group = await getDocument(collections.groups, groupId);
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
    gameTypes: group.gameTypes?.concat([gameType]) ?? [gameType],
  };

  await updateDocument(collections.groups, groupId, updatedGroup);
  return gameType;
};

export type UserResult = "WIN" | "DRAW" | "LOSS";

export const updateMultipleMemberships = async (
  updatedMemberships: Document<Membership>[],
  groupId: string
) => {
  const updatePromises: Promise<void>[] = [];
  updatedMemberships.forEach((membership) => {
    updatePromises.push(
      new Promise(async (resolve, reject) => {
        try {
          updateMembership(
            generateMembershipDocumentId(membership.userId, groupId),
            membership
          );
          resolve();
        } catch (err) {
          reject(err);
        }
      })
    );
  });
  return Promise.all(updatePromises).then((data) => data);
};

const updateMembership = async (
  membershipId: string,
  membership: Membership
) => {
  return await updateDocument(collections.memberships, membershipId, {
    ...membership,
  });
};
