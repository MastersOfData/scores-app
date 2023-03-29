"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { GamesBannerIcon } from "src/assets/icons/GamesBannerIcon";
import Input from "src/components/Input";
import styles from "../../styles/SignIn.module.css";
import { FormEvent, useState } from "react";
import { signIn } from "../../fire-base/auth";
import PageWrapper from "src/components/PageWrapper";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const searchParams = useSearchParams();

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    try {
      await signIn(username, password);
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl ?? "/");
    } catch (err) {
      console.error(err);
      alert("Oops, something went wrong!");
    }
  }

  return (
    <PageWrapper title="Logg inn" backPath="/">
      <div className={styles.container}>
        <div className={styles.gamesBanner}>{<GamesBannerIcon />}</div>
        <form onSubmit={handleSignIn} className={styles.form}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Email/Brukernavn:</p>
            <Input
              type="text"
              placeholder="Brukernavn"
              onInput={setUsername}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Passord:</p>
            <Input
              type="password"
              placeholder="Passord"
              onInput={setPassword}
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button variant={ButtonVariant.Round} color={ButtonColor.Green}>
              Logg inn
            </Button>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="button"
              withLink
              href="/register"
              variant={ButtonVariant.Small}
              color={ButtonColor.Pink}
            >
              Registrer ny bruker
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
