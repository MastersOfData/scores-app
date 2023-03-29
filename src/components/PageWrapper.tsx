"use client"

import styles from "src/styles/PageWrapper.module.css"
import Header from "src/components/Header"
import { onAuthStateChanged } from "src/fire-base/auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export type PageWrapperProps = {
  children?: React.ReactNode,
  title: string,
  authenticated?: boolean,
  backPath?: string
}

export default function PageWrapper({ children, title, authenticated, backPath }: PageWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(user => {
      setIsSignedIn(user !== null)
      setLoading(false)
    })

    return unsub
  }, [])

  if (loading) return <div>Loading...</div>

  if (!isSignedIn && authenticated) {
    router.push(`/sign-in?callbackUrl=${pathname}`)
    return <div>Redirecting...</div>
  }

  return (
    <div className={styles.container}>
      <Header backPath={backPath}>{title}</Header>
      {children}
    </div>
  )
}