"use client";

import styles from "../../styles/CreateGroupe.module.css";
import Input from "src/components/Input";
import { useState } from "react";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "../../components/PageWrapper";
import { getCurrentUser } from "src/fire-base/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "src/store/hooks";
import { createGroupAction } from "src/store/groupsInternal.reducer";

export default function CreateGroupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [groupName, setGroupName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");

  async function onSubmit() {
    if (groupName && emoji) {
      //Linjen under må endres når vi har ordnet access control 
      const user = getCurrentUser();

      if (user) {
        const group = await dispatch(
          createGroupAction({ currentUserId: user.uid, groupName: groupName, groupEmoji: emoji })
        ).unwrap();
        router.push(`group/${group.id}`);
      }
    }
  }

  return (
    <PageWrapper title='Ny gruppe' backPath='/'>
      <div>
        <form className={styles.form}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Gruppenavn:</p>
            <Input
              required
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
              required
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
              onClick={onSubmit}
              type="button"
            >
              Opprett gruppe
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
