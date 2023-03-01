"use client"

import { useEffect } from "react"
import { signIn, createAccount, signOut, onAuthStateChanged, signInWithGoogle } from "../../fire-base/auth"

export default function AuthTester() {

  useEffect(() => {
    return onAuthStateChanged(console.log)
  }, [])

  return (
    <div style={{display: "flex", gap: ".5rem"}}>
      <button onClick={() => createAccount("oliveroloughlin1@gmail.com", "pass123")}>Create account</button>
      <button onClick={() => signIn("oliveroloughlin1@gmail.com", "pass123")}>Sign in</button>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}