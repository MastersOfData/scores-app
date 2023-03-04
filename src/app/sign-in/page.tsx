"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { GamesBannerIcon } from "src/assets/icons/GamesBannerIcon";
import Input from "src/components/Input";
import styles from "../../styles/SignIn.module.css";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "../../../fire-base/auth";
import { BackArrowIcon } from "src/assets/icons/BackArrowIcon";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSignIn() {
    try {
      await signIn(username, password);
    } catch (err) {
      alert("Oops, something went wrong!");
    }
  }

  return (
    <main className={styles.container}>
      <span>
        <p onClick={router.back}>
          <BackArrowIcon />
        </p>
        <h1 className={styles.title}>Logg inn</h1>
      </span>
      <div className={styles.gamesBanner}>{<GamesBannerIcon />}</div>
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
          onClick={handleSignIn}
        >
          Logg inn
        </Button>
      </div>
      <div className={styles.buttonContainer}>
          <Button
            withLink
            href="/register"
            variant={ButtonVariant.Small}
            color={ButtonColor.Pink}
          >
            Registrer ny bruker
          </Button>
      </div>
    </main>
  );
}
