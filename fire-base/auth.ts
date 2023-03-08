import { auth } from "./services"
import { 
  signInWithEmailAndPassword, 
  signOut as _signOut, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged as _onAuthStateChanged, 
  NextOrObserver, 
  User, 
  GoogleAuthProvider } from "firebase/auth"

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

export async function createAccount(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export function onAuthStateChanged(observer: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, observer)
}

export function getCurrentUser() {
  return auth.currentUser
}