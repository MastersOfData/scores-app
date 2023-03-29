import { useEffect, useState } from "react"
import { User } from "src/fire-base/models"
import { onAuthStateChanged } from "src/fire-base/auth"
import { subscribeToDoc } from "src/fire-base/db"


export function useCurrentUserData() {
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    let unsubscribeFromUser: (() => void) | null = null

    const unsub = onAuthStateChanged(_user => {
      if (!_user) return
      unsubscribeFromUser = subscribeToDoc<User>("users", _user.uid, setUserData)
    })

    return () => {
      unsub()
      unsubscribeFromUser?.()
    }
  }, [])

  return userData
}