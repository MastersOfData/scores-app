import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAQG3eR4JCGXgxD6bjIJ_YkVa9OSjKUm_0",
  authDomain: "scores-app-a8c26.firebaseapp.com",
  projectId: "scores-app-a8c26",
  storageBucket: "scores-app-a8c26.appspot.com",
  messagingSenderId: "166006246251",
  appId: "1:166006246251:web:e4aec33034cd9bb2dc1a2e"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
