import { documentId, where } from "firebase/firestore";
import { useContext } from "react";
import { userContext } from "src/app/providers";
import { getDocuments, collections } from "src/fire-base/db";

export const useUser = () => useContext(userContext);

export const getUserId = async (userName: string) => {
  const users = await getDocuments({
    collection: collections.users,
    constraints: [where("username", "==", userName)],
  });
  if (users.length > 0) {
    return users[0].id;
  }
};

export const getUserName = async (userId: string) => {
  const users = await getDocuments({
    collection: collections.users,
    constraints: [where(documentId(), "==", userId)],
  });
  if (users.length > 0) {
    return users[0].username;
  }
};

export const getMultipleUsernamesFromIds = async (userIds: string[]) => {
  const usernameMap = new Map<string, string | undefined>();
  Promise.all(
    userIds.map(async (userId) => {
      const username = await getUserName(userId);
      usernameMap.set(userId, username);
    })
  );
  return usernameMap;
};
