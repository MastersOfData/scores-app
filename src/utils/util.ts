import { Timestamp } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { CardItem } from "src/components/Card";
import { GroupInternal } from "../types/types";

export const testFunc = () => true;

export const generateUserGroupStatisticDocumentId = (
  userId: string,
  groupId: string
): string => userId + "-" + groupId;

// IKKE FJERN enda. Kan hende den trengs
// export const unwrapUserGroupStatisticDocumentId = (
//   documentId: string,
// ): {userId: string, groupId: string} => {
//   const ids = documentId.split("-");
//   return {
//     userId: ids[0],
//     groupId: ids[1],
//   };
// }

export const differenceBetweenFirestoreTimestampsInDays = (
  t1: Timestamp,
  t2: Timestamp
): number => {
  const unixTimestamp1 = t1.toMillis() / 1000;
  const unixTimestamp2 = t2.toMillis() / 1000;

  const secondsDiff = unixTimestamp2 - unixTimestamp1;
  const daysDiff = secondsDiff / (24 * 60 * 60);

  return Math.floor(daysDiff);
};

export const mapGroupsToCardItems = (
  groups: GroupInternal[],
  includeLabels: boolean,
  router: AppRouterInstance
): CardItem[] => {
  return groups.map((group) => {
    return {
      key: group.id,
      title: group.name,
      labels: includeLabels ? ["Noe relevant info", "Annen info"] : undefined,
      emoji: group.emoji,
      onClick: () => router.push(`/group/${group.id}`),
    };
  });
};
