import Link from "next/link"
import styles from "../styles/Home.module.css"

export default function Home() {
  return (
    <main className={styles.container}>
      Home Page
      <br/>
      <Link href="/testing">Testing</Link>
      <Link href="/register">Registrer</Link>
    </main>
  )
}
