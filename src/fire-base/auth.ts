import { auth } from "./config";
import { collections, setDocument, getDocuments } from "./db";
import { User } from "./models";
export { updateProfile, updatePassword } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  signOut as _signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User as FirebaseUser,
  GoogleAuthProvider,
} from "firebase/auth";
import { where } from "firebase/firestore";


export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  return await signInWithPopup(auth, provider);
}

export async function signOut(callback?: () => void) {
  callback?.();
  return await _signOut(auth);
}

export async function createAccount(
  email: string,
  username: string,
  password: string
) {

  const exist = await userExist(username);
  if(exist){
    return false;
  }


  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await setDocument(collections.users, credentials.user.uid, {
    email,
    username,
  });

  return true;
}

export function onAuthStateChanged(observer: NextOrObserver<FirebaseUser>) {
  return _onAuthStateChanged(auth, observer);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function isSignedIn() {
  return auth.currentUser !== null;
}

export const userExist = async (username: string) =>  {
  const users = await getDocuments({
    collection: collections.users,
    constraints: [where("username", "==", username)],
  });
  
  if (users.length > 0) {
    return true;
  }
  return false;
}