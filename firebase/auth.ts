import { auth } from "./services"
import { signInWithEmailAndPassword, signOut as _signOut, createUserWithEmailAndPassword, onAuthStateChanged as _onAuthStateChanged, NextOrObserver, User } from "firebase/auth/cordova"

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  return await _signOut(auth)
}

export async function createAccount(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export function onAuthStateChanged(observer: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, observer)
}