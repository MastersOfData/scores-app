"use client";

import { useRouter } from "next/navigation";

import { GamesIcon } from "src/assets/icons/GamesIcon";
import { Button, ButtonVariant } from "src/components/Button";
import Input from "src/components/Input";
import styles from "../../styles/Register.module.css";

interface RegisterFields {
  email: string;
  username: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const onSubmit = async (data: RegisterFields) => {
    console.log(data);
  };

  return (
    <main className={styles.container}>
      <h1>Registrer</h1>
      <GamesIcon />
      <div className="form-group">
        <form
          className={styles.form}
          onSubmit={() =>
            onSubmit({
              email: "mock@mock.com",
              username: "mock",
              password: "mockito123",
            })
          }
        >
          <div className={styles["label-input-group"]}>
            <label>E-postadresse:</label>
            <Input type="email" placeholder="Skriv e-postadresse..." />
          </div>
          <div className={styles["label-input-group"]}>
            <label>Brukernavn:</label>
            <Input type="text" placeholder="Skriv brukernavn..." />
          </div>
          <div className={styles["label-input-group"]}>
            <label>Passord:</label>
            <Input type="password" placeholder="Skriv passord..." />
          </div>
          <Button
            variant={ButtonVariant.Round}
            className={styles["button--submit"]}
          >
            Registrer
          </Button>
        </form>
      </div>
    </main>
  );
}
