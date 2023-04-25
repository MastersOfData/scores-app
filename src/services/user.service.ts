import { where } from "firebase/firestore";
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


// export const getUserName = async (userId: string) => {
//   const users = await getDocuments({
//     collection: collections.users,
//     constraints: [where("username", "==", userName)],
//   });
//   if (users.length > 0) {
//     return users[0].id;
//   }
// };