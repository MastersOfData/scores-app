"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount } from "fire-base/auth";
import { GamesBannerIcon } from "src/assets/icons/GamesBannerIcon";
import { Button, ButtonVariant } from "src/components/Button";
import Input from "src/components/Input";
import styles from "../../styles/Register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await createAccount(email, password)
      router.push("/")
    }
    catch (err) {
      console.error(err)
      alert("Oops, something went wrong")
    }
  };

  return (
    <main className={styles.container}>
      <h1>Registrer</h1>
      <div className={styles.banner}>
        <GamesBannerIcon />
      </div>
      <div className="form-group">
        <form
          className={styles.form}
          onSubmit={onSubmit}
        >
          <div className={styles["label-input-group"]}>
            <label>E-postadresse:</label>
            <Input
              type="email"
              placeholder="Skriv e-postadresse..."
              onInput={setEmail}
            />
          </div>
          <div className={styles["label-input-group"]}>
            <label>Passord:</label>
            <Input
              type="password"
              placeholder="Skriv passord..."
              onInput={setPassword}
            />
          </div>
          <Button
            variant={ButtonVariant.Round}
            className={styles["button-container"]}
          >
            Registrer
          </Button>
        </form>
      </div>
    </main>
  );
}
