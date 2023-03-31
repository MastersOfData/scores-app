"use client";

import styles from "../../styles/CreateGroupe.module.css";
import Input from "src/components/Input";
import { useState } from "react";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "../../components/PageWrapper";
import { useRouter } from "next/navigation";
import { useAppDispatch, useGetGroupsForCurrentUser } from "src/store/hooks";
import { createGroupAction } from "src/store/groupsInternal.reducer";
import { DataStatus } from "../../store/store.types";
import Spinner from "../../components/Spinner";
import { useUser } from "src/services/user.service";

export default function CreateGroupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser()
  const groups = useGetGroupsForCurrentUser();

  const [groupName, setGroupName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  async function onSubmit() {
    if (groupName && emoji) {
      if (user) {
        setHasSubmitted(true);
        const group = await dispatch(
          createGroupAction({
            currentUserId: user.uid,
            groupName: groupName,
            groupEmoji: emoji,
          })
        ).unwrap();
        router.push(`group/${group.id}`);
      }
    }
  }

  if (groups.create.status === DataStatus.LOADING || hasSubmitted)
    return <Spinner />;

  return (
    <PageWrapper title='Ny gruppe' backPath='/' authenticated={true} >
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
              defaultValue={emoji}
              required
              className={styles.emojiStyle}
              type='text'
              placeholder=''
              onInput={(input) => {
                if (input.match(/\p{Emoji}/gu) || input === "") {
                  setEmoji(input);
                }
              }}
              maxLength={2}
            />
          </div>
          <div className='center-items'>
            <Button
              className={styles["button-container"]}
              variant={ButtonVariant.Round}
              color={ButtonColor.Green}
              onClick={onSubmit}
              type='button'
            >
              Opprett gruppe
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
