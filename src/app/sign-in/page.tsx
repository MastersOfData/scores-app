"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { GamesBannerIcon } from "src/assets/icons/GamesBannerIcon";
import Input from "src/components/Input";
import styles from "../../styles/SignIn.module.css";
import { FormEvent, useState } from "react";
import { signIn } from "../../fire-base/auth";
import Header from "src/components/Header";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSignIn(e: FormEvent) {
    e.preventDefault()
    try {
      await signIn(username, password);
      router.push("/")
    } catch (err) {
      console.error(err)
      alert("Oops, something went wrong!");
    }
  }

  // TODO: Insert Header component
  return (
    <main className={styles.container}>
      <Header>Log in</Header>
      <div className={styles.gamesBanner}>{<GamesBannerIcon />}</div>
      <form onSubmit={handleSignIn}>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Email/Brukernavn:</p>
          <Input type="text" placeholder="Brukernavn" onInput={setUsername} />
        </div>
        <div className={styles.inputContainer}>
          <p className={styles.inputLabel}>Passord:</p>
          <Input type="password" placeholder="Passord" onInput={setPassword} />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant={ButtonVariant.Round}
            color={ButtonColor.Green}
          >
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
    </main>
  );
}
