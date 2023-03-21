"use client";

import styles from "../../styles/CreateGroupe.module.css";
import Input from "src/components/Input";
import { FormEvent, useState } from "react";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "../../components/PageWrapper";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <PageWrapper title='Ny gruppe' backPath='/'>
      <div>
        <form className={styles.form}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Gruppenavn:</p>
            <Input
              className={styles.inputStyle}
              type='text'
              placeholder='Skriv gruppenavn...'
              onInput={setGroupName}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Emoji:</p>
          </div>
          <div className={styles.emojiContainer}>
            <Input
              className={styles.emojiStyle}
              type='text'
              placeholder=''
              onInput={setEmoji}
              maxLength={2}
            />
          </div>
          <div className='center-items'>
            <Button
              className={styles["button-container"]}
              variant={ButtonVariant.Round}
              color={ButtonColor.Green}
              onSubmit={(e) => onSubmit(e)}
            >
              Opprett gruppe
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
