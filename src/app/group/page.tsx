"use client";

import { ControllerIcon } from "../../assets/icons/ControllerIcon";
import { PeopleIcon } from "../../assets/icons/PeopleIcon";
import { ResultsIcon } from "../../assets/icons/ResultsIcon";
import { Button, ButtonColor, ButtonVariant } from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import styles from "../../styles/Home.module.css";

const GroupPage = () => {
  return (
    <PageWrapper title='Gruppe 🎲' backPath='/'>
      <div className={styles["buttons-container"]}>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Green}
            withLink
            href='/'
          >
            <ResultsIcon />
          </Button>
          <p className={styles.label}>Registrer resultat</p>
        </div>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Orange}
            withLink
            href='/'
          >
            <ControllerIcon />
          </Button>
          <p className={styles.label}>Start spill</p>
        </div>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Pink}
            withLink
            href='/'
          >
            <PeopleIcon />
          </Button>
          <p className={styles.label}>Administrer medlemmer</p>
        </div>
      </div>
      <h2>Leaderboard</h2>
    </PageWrapper>
  );
};

export default GroupPage;
