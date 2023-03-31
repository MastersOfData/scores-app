"use client";

import styles from "../../../../styles/CreateGroupe.module.css";
import Input from "src/components/Input";
import { FC, FormEvent, useState } from "react";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import {
  useAppDispatch,
  useGetGroupsForCurrentUser,
} from "../../../../store/hooks";
import { createGameTypeAction } from "../../../../store/groupsInternal.reducer";
import { DataStatus } from "../../../../store/store.types";
import { useRouter } from "next/navigation";
import Spinner from "../../../../components/Spinner";

interface CreateGameTypePageProps {
  params: { groupId: string };
}

const CreateGameTypePage: FC<CreateGameTypePageProps> = ({ params }) => {
  const [gameTypeName, setGameTypeName] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const groups = useGetGroupsForCurrentUser();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { groupId } = params;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    await dispatch(
      createGameTypeAction({
        gameType: {
          name: gameTypeName,
          emoji: emoji,
        },
        groupId,
      })
    ).unwrap();

    router.push(`group/${groupId}`);
  };

  if (
    groups.update.dataId === groupId ||
    groups.update.status === DataStatus.LOADING ||
    hasSubmitted
  ) {
    return <Spinner />;
  }

  return (
    <PageWrapper title='Lag spilltype' backPath={`group/${groupId}`} authenticated={true} >
      <div>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputContainer}>
            <p className={styles.inputLabel}>Spillnavn:</p>
            <Input
              required
              className={styles.inputStyle}
              type='text'
              placeholder='Spillnavn...'
              onInput={setGameTypeName}
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
              type='submit'
            >
              Opprett spilltype
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default CreateGameTypePage;
