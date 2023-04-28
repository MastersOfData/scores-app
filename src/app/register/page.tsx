"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount } from "src/fire-base/auth";
import { GamesBannerIcon } from "src/assets/icons/GamesBannerIcon";
import { Button, ButtonVariant } from "src/components/Button";
import Input from "src/components/Input";
import styles from "../../styles/Register.module.css";
import signInStyles from "../../styles/SignIn.module.css";
import PageWrapper from "src/components/PageWrapper";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const success = await createAccount(email, username, password);
      if (!success) {
        alert("Username already exists");
        return;
      }
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Oops, something went wrong");
    }
  }

  return (
    <PageWrapper title='Registrer' backPath='/'>
      <div className={signInStyles.container}>
        <div className={styles.banner}>
          <GamesBannerIcon />
        </div>
        <div className='form-group'>
          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles["label-input-group"]}>
              <label>E-postadresse:</label>
              <Input
                type='email'
                placeholder='Skriv e-postadresse...'
                onInput={setEmail}
              />
            </div>
            <div className={styles["label-input-group"]}>
              <label>Brukernavn:</label>
              <Input
                type='text'
                placeholder='Skriv brukernavn...'
                onInput={setUsername}
              />
            </div>
            <div className={styles["label-input-group"]}>
              <label>Passord:</label>
              <Input
                type='password'
                placeholder='Skriv passord...'
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
      </div>
    </PageWrapper>
  );
}
