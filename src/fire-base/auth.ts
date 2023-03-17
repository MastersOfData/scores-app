import { auth } from "./config"
import { setDocument } from "./db"
import { User } from "./models"
import { 
  signInWithEmailAndPassword, 
  signOut as _signOut, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged as _onAuthStateChanged, 
  NextOrObserver, 
  User as FirebaseUser, 
  GoogleAuthProvider } from "firebase/auth"

export { updatePassword, updateProfile } from "firebase/auth"

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.addScope("email")
  return await signInWithPopup(auth, provider)
}

export async function signOut() {
  return await _signOut(auth)
}

export async function createAccount(email: string, username: string, password: string) {
  const credentials = await createUserWithEmailAndPassword(auth, email, password)
  await setDocument<User>("users", credentials.user.uid, {
    email,
    username,
  })
}

export function onAuthStateChanged(observer: NextOrObserver<FirebaseUser>) {
  return _onAuthStateChanged(auth, observer)
}

export function getCurrentUser() {
  return auth.currentUser
}