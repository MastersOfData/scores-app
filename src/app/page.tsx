"use client"

import Link from "next/link"
import styles from "../styles/Home.module.css"
import { getCurrentUser } from "fire-base/auth"

export default function Home() {
  return (
    <main className={styles.container}>
      <h1>Hello {getCurrentUser()?.email}!</h1>
      <br/>
      <Link href="/testing">Testing</Link>
      <br/>
      <Link href="/register">Registrer</Link>
    </main>
  )
}
