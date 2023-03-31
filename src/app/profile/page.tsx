"use client";

import Input from "src/components/Input";
import { useState, FormEvent, useRef } from "react";
import { validatePassword } from "src/utils/validation";
import styles from "src/styles/Account.module.css";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import PageWrapper from "src/components/PageWrapper";
import { usePathname, useRouter } from "next/navigation";
import { updateDocument } from "src/fire-base/db";
import { User } from "src/fire-base/models";
import { useUser } from "src/services/user.service";

export default function AccountPage() {
  const { user, userData } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [infoComponent, setInfoComponent] = useState<React.ReactNode>(null);
  const usernameRef = useRef(userData?.username ?? "");
  const passwordRef = useRef("");
  const confPasswordRef = useRef("");

  async function handleUpdateUser(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const username = usernameRef.current;
    if (!username) return;

    try {
      await updateDocument<User>("users", user.uid, {
        username,
      });

      setInfoComponent(
        <p className={`${styles.info} ${styles.success}`}>
          Brukernavn ble oppdatert
        </p>
      );
    } catch (err) {
      console.error(err);
      setInfoComponent(
        <p className={`${styles.info} ${styles.error}`}>Noe gikk galt!</p>
      );
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const form = e.target as HTMLFormElement;
    const { updatePassword } = await import("src/fire-base/auth");

    const password = passwordRef.current;
    const confPassword = confPasswordRef.current;

    if (confPassword !== password) {
      setInfoComponent(
        <p className={`${styles.info} ${styles.error}`}>
          Passordene samsvarer ikke!
        </p>
      );
      return;
    }

    const { valid, error } = validatePassword(password);
    if (!valid) {
      setInfoComponent(
        <p className={`${styles.info} ${styles.error}`}>{error}</p>
      );
      return;
    }

    try {
      await updatePassword(user, password);
    } catch (err) {
      console.log(err);
      router.push(`/sign-in?callbackUrl=${pathname}`);
      return;
    }

    form.reset();
    setInfoComponent(
      <p className={`${styles.info} ${styles.success}`}>
        Ditt passord ble oppdattert!
      </p>
    );
  }

  async function handleSignOut() {
    const { signOut } = await import("src/fire-base/auth");
    await signOut();
  }

  return (
    <PageWrapper title='Profil' authenticated={true} backPath='/'>
      <main className={styles.main}>
        {infoComponent}
        <form className={styles.form} onSubmit={handleUpdateUser}>
          <div>
            <strong>Brukernavn</strong>
            <Input
              type='text'
              valueRef={usernameRef}
              defaultValue={userData?.username}
            />
          </div>
          <div>
            <strong>E-post</strong>
            <p>{userData?.email}</p>
          </div>
          <Button variant={ButtonVariant.Round} color={ButtonColor.Green}>
            Lagre endringer
          </Button>
        </form>
        <form className={styles.form} onSubmit={handleChangePassword}>
          <div>
            <strong>Endre password</strong>
            <Input
              type='password'
              placeholder='Nytt passord'
              valueRef={passwordRef}
            />
          </div>
          <Input
            type='password'
            placeholder='Bekreft passord'
            valueRef={confPasswordRef}
          />
          <Button variant={ButtonVariant.Round} color={ButtonColor.Green}>
            Endre passord
          </Button>
          <span className={styles["button-container"]}>
            <Button
              variant={ButtonVariant.Medium}
              color={ButtonColor.Red}
              onClick={handleSignOut}
            >
              Logg ut
            </Button>
          </span>
        </form>
      </main>
    </PageWrapper>
  );
}
