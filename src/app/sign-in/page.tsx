"use client";

import router from "next/router";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { GamesBanner } from "src/components/GamesBanner";
import Input from "src/components/Input";
import styles from "../../styles/SignIn.module.css";

export default function SignInPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Logg inn</h1>
      <div className={styles.gamesBanner}>{GamesBanner({})}</div>
      <div className={styles.inputContainer}>
        <p className={styles.inputLabel}>Email/Brukernavn:</p>
        <Input
          type="text"
          placeholder="Text Input"
          onInput={() => console.log()}
        />
      </div>
      <div className={styles.inputContainer}>
        <p className={styles.inputLabel}>Passord:</p>
        <Input
          type="password"
          placeholder="Password Input"
          onInput={() => console.log()}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant={ButtonVariant.Round}
          color={ButtonColor.Green}
          onClick={() => router.push("/")}
        >
          Logg inn
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant={ButtonVariant.Small}
          color={ButtonColor.Pink}
          onClick={() => router.push("/")}
        >
          Registrer ny bruker
        </Button>
      </div>
    </main>
  );
}
