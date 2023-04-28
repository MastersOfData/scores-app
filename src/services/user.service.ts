import { documentId, where, CollectionReference, UpdateData, DocumentData  } from "firebase/firestore";

import { useContext } from "react";
import { userContext } from "src/app/providers";
import { getDocuments, collections, updateDocument } from "src/fire-base/db";
import { userExist } from "src/fire-base/auth";

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

export const updateUserName = async (username: string, userId: string) => {
  const exist = await userExist(username);
  if (exist) {
    return false
  } 
try{
    await updateDocument(collections.users, userId, {
      username,
    });

    return true
  }
  catch{
    return false
  }
}
