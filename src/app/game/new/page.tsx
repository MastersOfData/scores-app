"use client";

import { FC, useState } from "react";
import styles from "src/styles/RegisterResult.module.css";
import PageWrapper from "src/components/PageWrapper";
import { RadioCards } from "src/components/RadioCards";
import TitleWithInfo from "src/components/TitleWithInfo";
import { CheckboxCards } from "src/components/CheckboxCards";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { useAppDispatch, useGetGroupsForCurrentUser } from "src/store/hooks";
import { useRouter } from "next/navigation";
import { createGameAction } from "src/store/game.reducer";
import { DataStatus } from "src/store/store.types";
import { useUser } from "src/services/user.service";
import Spinner from "../../../components/Spinner";

const CreateGamePage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const groupsWithStatus = useGetGroupsForCurrentUser();
  const { user } = useUser();

  const [isGroupGame] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [participants, setParticipants] = useState<string[]>([]);
  const [allowTeams] = useState<boolean>(false);

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const onSubmit = async () => {
    if (user && selectedGroup && selectedGame) {
      setHasSubmitted(true);
      const game = await dispatch(
        createGameAction({
          userId: user.uid,
          gameData: {
            groupId: selectedGroup,
            gameTypeId: selectedGame,
            allowTeams: allowTeams,
            participants: participants,
          },
        })
      ).unwrap();
      router.push(`game/${game.id}`);
      setHasSubmitted(false);
    } else {
      alert(
        `Mangler verdier for: ${selectedGroup ?? "Gruppe"} ${
          selectedGame ?? "Spill"
        }`
      );
    }
  };

  if (
    !groupsWithStatus.data ||
    groupsWithStatus.status === DataStatus.LOADING ||
    hasSubmitted
  ) {
    return <Spinner />;
  }

  const group = groupsWithStatus.data.find((g) => g.id === selectedGroup);

  return (
    <PageWrapper title='Start spill' backPath='/game'>
      {/* <div>
        <TitleWithInfo
          title='Vil du spille med en gruppe?'
          infoText='Om du velger å spille uten gruppe vil ikke resultatene lagres'
        />
        <div className={styles["toggle-container"]}>
          <div className={styles["toggle-section"]}>
            <Input
              type='toggle'
              onInput={setIsGroupGame}
              initialValue={isGroupGame}
            />
          </div>
        </div>
      </div> */}
      {isGroupGame && (
        <div>
          <h2 className={styles["title-centered"]}>Velg gruppe</h2>
          <div className={styles["groups-container"]}>
            {groupsWithStatus.data.length > 0 ? (
              <RadioCards
                items={groupsWithStatus.data.map((group) => ({
                  title: group.emoji + " " + group.name,
                  key: group.id,
                }))}
                selected={selectedGroup}
                setSelected={setSelectedGroup}
              />
            ) : (
              <p>
                Du er ikke medlem i noen grupper eller så finner vi ikke
                gruppene dine for øyeblikket.
              </p>
            )}
          </div>
        </div>
      )}
      {selectedGroup ? (
        <>
          <TitleWithInfo
            title='Velg spill'
            infoText='Velg spillet det skal føres poeng for'
          />
          <div className={styles["groups-container"]}>
            <RadioCards
              items={groupsWithStatus.data
                .find((g) => g.id === selectedGroup)
                ?.gameTypes?.map((gameType) => ({
                  title: gameType.emoji + " " + gameType.name,
                  key: gameType.id,
                }))}
              selected={selectedGame}
              setSelected={setSelectedGame}
              fallbackMessage='Fant ingen spill for den valgte gruppen.'
            />
          </div>
        </>
      ) : null}
      {/* <div>
        <TitleWithInfo
          title='Ønsker du lag?'
          infoText='Ønsker du at deltagerne skal deles inn i lag?'
        />
        <div className={styles["toggle-container"]}>
          <div className={styles["toggle-section"]}>
            <Input
              type='toggle'
              onInput={setAllowTeams}
              initialValue={allowTeams}
            />
          </div>
        </div>
      </div> */}
      {group && group.members && selectedGame && (
        <div>
          <h2 className={styles["title-centered"]}>Velg deltagere</h2>
          <div className={styles["groups-container"]}>
            <CheckboxCards
              items={group.members.map((user) => ({
                title: user.username,
                key: user.id,
              }))}
              checked={participants}
              setChecked={setParticipants}
            />
          </div>
        </div>
      )}
      {participants.length > 0 && (
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Round}
            color={ButtonColor.Green}
            onClick={onSubmit}
          >
            Start spill
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default CreateGamePage;
