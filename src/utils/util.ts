export const testFunc = () => true;

export const generateUserGroupStatisticDocumentId = (
  userId: string,
  groupId: string
): string => userId + "-" + groupId;

// export const unwrapUserGroupStatisticDocumentId = (
//   documentId: string,
// ): {userId: string, groupId: string} => {
//   const ids = documentId.split("-");
//   return {
//     userId: ids[0],
//     groupId: ids[1],
//   };
// }