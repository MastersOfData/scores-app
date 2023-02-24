import { auth } from "./services"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth/cordova"

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function createAccount(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password)
}