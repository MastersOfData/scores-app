import { DocumentReference } from "firebase/firestore";
import { atom } from "jotai";
import { loadable } from "jotai/utils";
import { addDocument } from "../fire-base/db";
import { Group } from "../fire-base/models";

interface User {
  username: string;
  email: string;
}

const fetchUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return { username: "Username123", email: "user@scores.app" };
};

const fetchUserAtom = atom<Promise<User>>(async () => {
  return await fetchUser();
});

export const userLoader = loadable(fetchUserAtom);

const createGroupAtom = atom<Promise<DocumentReference<Group>>>(async () => {
  const res = await addDocument("groups", {
    name: "Test group",
    emoji: "🎲",
    games: ["abhibsdhfvdjb12he3b23", "snjhdbfsedu8fiuwhbej23r"],
    invitationCode: "aiv8nd",
  });
  return res;
});

export const createGroupLoadable = loadable(createGroupAtom);
