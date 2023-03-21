"use client"

import { useHeader } from "src/components/Header"
import Input from "src/components/Input"
import { useState, FormEvent } from "react"
import { validatePassword } from "src/utils/validation"
import { getCurrentUser, updatePassword } from "src/fire-base/auth"
import styles from "src/styles/Account.module.css"
import { Button, ButtonColor, ButtonVariant } from "src/components/Button"

export default function AccountPage() {
  useHeader("Profil", "/")

  const [password, setPassword] = useState<string>("")
  const [confPassword, setConfPassword] = useState<string>("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (confPassword !== password) {
      // TODO: Inform about mismatch
      return
    }

    const { valid, error } = validatePassword(password)
    if (!valid) {
      // TODO: Inform about error
      return
    }

    const user = getCurrentUser()
    if (!user) {
      // TODO: Redirect to sign in?
      return
    }

    await updatePassword(user, password)
  }

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <strong>Endre password</strong>
          <Input
            type="password"
            placeholder="Nytt passord"
            onInput={setPassword}
          />
        </div>
        <Input
          type="password"
          placeholder="Bekreft passord"
          onInput={setConfPassword}
        />
        <Button variant={ButtonVariant.Round} color={ButtonColor.Green}>Endre passord</Button>
        <span className={styles["button-container"]}>
          <Button variant={ButtonVariant.Medium} color={ButtonColor.Red}>Logg ut</Button>
        </span>
      </form>
    </main>
  )
}