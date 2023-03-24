"use client"

import Input from "src/components/Input"
import { useState, FormEvent } from "react"
import { validatePassword } from "src/utils/validation"
import { getCurrentUser, signOut, updatePassword } from "src/fire-base/auth"
import styles from "src/styles/Account.module.css"
import { Button, ButtonColor, ButtonVariant } from "src/components/Button"
import PageWrapper from "src/components/PageWrapper"
import { usePathname, useRouter } from "next/navigation"
import { useCurrentUserData } from "src/services/user.service"

export default function AccountPage() {
  const [password, setPassword] = useState<string>("")
  const [confPassword, setConfPassword] = useState<string>("")
  const [infoComponent, setInfoComponent] = useState<React.ReactNode>(null) 
  const userData = useCurrentUserData()
  const router = useRouter()
  const pathname = usePathname()

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement

    if (confPassword !== password) {
      setInfoComponent(<p className={`${styles.info} ${styles.error}`}>Passordene samsvarer ikke!</p>)
      return
    }

    const { valid, error } = validatePassword(password)
    if (!valid) {
      setInfoComponent(<p className={`${styles.info} ${styles.error}`}>{error}</p>)
      return
    }

    const user = getCurrentUser()
    if (!user) {
      router.push("/sign-in")
      return
    }

    try {
      await updatePassword(user, password)
    }
    catch (err) {
      console.log(err)
      router.push(`/sign-in?callbackUrl=${pathname}`)
      return
    }

    form.reset()
    setInfoComponent(<p className={`${styles.info} ${styles.success}`}>Ditt passord ble oppdattert!</p>)
  }

  return (
    <PageWrapper title="Profil" authenticated={true}>
      <main className={styles.main}>
        <div>
          <strong>Brukernavn: </strong>
          <p>{userData?.username}</p>
        </div>
        <form className={styles.form} onSubmit={handleChangePassword}>
          {infoComponent}
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
            <Button variant={ButtonVariant.Medium} color={ButtonColor.Red} onClick={signOut}>Logg ut</Button>
          </span>
        </form>
      </main>
    </PageWrapper>
  )
}