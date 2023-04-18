"use client";

import { User } from "firebase/auth";
import { User as UserData } from "src/fire-base/models"
import { Provider } from "react-redux";
import { store } from "../store/store";
import { createContext, FC, useEffect, useState } from "react";
import { onAuthStateChanged } from "src/fire-base/auth";
import { collections, getDocument } from "src/fire-base/db";

export type ProviderProps = {
  children: React.ReactNode
}

export type UserContext = {
  user: User | null,
  userData: UserData | null,
  loading: boolean
}

export const userContext = createContext<UserContext>({
  user: null,
  userData: null,
  loading: true
})

const UserContextProvider: FC<ProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(async _user => {
      setUser(_user)
      setLoading(false)
      const userData = _user ? await getDocument(collections.users, _user.uid) : null
      setUserData(userData)
    })
  }, [])

  const context: UserContext = {
    user,
    userData,
    loading
  }

  return <userContext.Provider value={context}>{children}</userContext.Provider>
}

const StateProvider: FC<ProviderProps> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

const Providers: FC<ProviderProps> = ({ children }) => (
  <StateProvider>
    <UserContextProvider>
      {children}
    </UserContextProvider>
  </StateProvider>
)

export default Providers
