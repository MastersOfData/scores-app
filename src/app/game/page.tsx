"use client";

import { ControllerIcon } from "../../assets/icons/ControllerIcon";
import { ResultsIcon } from "../../assets/icons/ResultsIcon";
import { Button, ButtonColor, ButtonVariant } from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import homeStyles from "../../styles/Home.module.css";

export default function GamePage() {
  return (
    <PageWrapper title='Spill' backPath='/'>
      <div className={homeStyles["buttons-container"]}>
        <div className={homeStyles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Green}
            withLink
            href='/game/register-result'
          >
            <ResultsIcon />
          </Button>
          <p className={homeStyles["label"]}>Registrer resultat</p>
        </div>
        <div className={homeStyles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Orange}
            withLink
            href='/game/new'
          >
            <ControllerIcon />
          </Button>
          <p className={homeStyles["label"]}>Nytt spill</p>
        </div>
      </div>
    </PageWrapper>
  );
}
