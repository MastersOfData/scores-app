"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { GamesBannerIcon } from "src/assets/icons/GamesBannerIcon";
import Input from "src/components/Input";
import styles from "../../styles/SignIn.module.css";
import { FormEvent, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import Spinner from "../../components/Spinner";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const searchParams = useSearchParams();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);

    const { signIn } = await import("../../fire-base/auth");

    try {
      await signIn(username, password);
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl ?? "/");
      setHasSubmitted(false);
    } catch (err) {
      console.error(err);
      alert("Oops, something went wrong!");
      setHasSubmitted(false);
    }
  }

  if (hasSubmitted) {
    return <Spinner />;
  }

  return (
    <PageWrapper title='Logg inn' backPath='/'>
      <div className={styles.container}>
        <div className={styles.gamesBanner}>{<GamesBannerIcon />}</div>
        <form onSubmit={handleSignIn} className={styles.form}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Email:</p>
            <Input
              type='text'
              placeholder='Email...'
              onInput={setUsername}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Passord:</p>
            <Input
              type='password'
              placeholder='Passord...'
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
              type='button'
              withLink
              href='/register'
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
