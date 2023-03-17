"use client";

import Link from "next/link";
import styles from "../styles/Home.module.css";
import { getCurrentUser } from "src/fire-base/auth";
import Header from "src/components/Header";
import { ControllerIcon } from "src/assets/icons/ControllerIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { PersonIcon } from "src/assets/icons/PersonIcon";
import { GroupIcon } from "src/assets/icons/GroupIcon";
import Input from "src/components/Input";

export default function Home() {
  return (
    <main className={styles.container}>
      <Header>Velkommen</Header>
      <div className={styles["buttons-container"]}>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action}>
            <PersonIcon />
          </Button>
          <p className={styles.label}>Profil</p>
        </div>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action} color={ButtonColor.Red}>
            <ControllerIcon />
          </Button>
          <p className={styles.label}>Nytt spill</p>
        </div>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action} color={ButtonColor.Yellow}>
            <GroupIcon />
          </Button>
          <p className={styles.label}>Ny gruppe</p>
        </div>
      </div>
      <p className={styles.title}>Bli med i en gruppe</p>
      <div className={styles["group-input-container"]}>
        <Input type="text" />
        <Button variant={ButtonVariant.Medium} color={ButtonColor.Pink}>
          Bli med
        </Button>
      </div>
    </main>
  );
}
