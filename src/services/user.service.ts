import { where } from "firebase/firestore";
import { useContext } from "react";
import { userContext } from "src/app/providers";
import { getDocuments, collections } from "src/fire-base/db";
import { User } from "src/fire-base/models";

export const useUser = () => useContext(userContext);

export const getUserId = async (userName: string) => {
  const users = await getDocuments<User>({
    collection: collections.users,
    constraints: [where("username", "==", userName)],
  });
  if (users.length > 0) {
    return users[0].id;
  }
};
