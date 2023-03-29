"use client";

import { FC, useState } from "react";
import styles from "src/styles/RegisterResult.module.css";
import PageWrapper from "src/components/PageWrapper";
import { User } from "src/fire-base/models";
import { RadioCards } from "src/components/RadioCards";
import TitleWithInfo from "src/components/TitleWithInfo";
import { CheckboxCards } from "src/components/CheckboxCards";
import Input from "src/components/Input";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { useAppDispatch, useGetGroupsForCurrentUser } from "src/store/hooks";
import { useRouter } from "next/navigation";
import { createGameAction } from "src/store/game.reducer";
import { DataStatus } from "src/store/store.types";
import { GameType, WithId } from "src/types/types";

const CreateGamePage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const groupsWithStatus = useGetGroupsForCurrentUser();

  //Mock games
  const gameTypes: WithId<GameType>[] = [
    { id: "bingo0", name: "Bingo", emoji: "🎰" },
    { id: "tennis0", name: "Tennis", emoji: "🎾" },
    { id: "yatzy0", name: "Yatzy", emoji: "🎲" },
  ];

  //Mock users
  const users: WithId<User>[] = [
    { id: "123", email: "birger@hvl.no", username: "xXbirgerXx" },
    { id: "911", email: "atle@hvl.no", username: "atle" },
    { id: "NUGO74z5Z5dA2lW71UCshMYIF2D3", email: "asd@asd.com", username: "atlebirger" },
  ];

  const [isGroupGame, setIsGroupGame] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [selectedGame, setSelectedGame] = useState<string | undefined>();
  const [participants, setParticipants] = useState<string[]>([]);
  const [allowTeams, setAllowTeams] = useState<boolean>(false);

  const onSubmit = async () => {
    if (selectedGroup && selectedGame) {
      const game = await dispatch(
        createGameAction({
          gameData: {
            groupId: selectedGroup,
            gameTypeId: selectedGame,
            allowTeams: allowTeams,
            participants: participants,
          },
        })
      ).unwrap();
      router.push(`game/${game.groupId}/${game.id}`);
    } else {
      alert(`Mangler verdier for: ${selectedGroup ?? "Gruppe"} ${selectedGame ?? "Spill"}`);
    }
  };

  if (
    !groupsWithStatus.data ||
    groupsWithStatus.status === DataStatus.LOADING
  ) {
    return <p>Loading...</p>;
  }

  return (
    <PageWrapper title="Start spill" backPath="/">
      <div>
        <TitleWithInfo
          title="Vil du spille med en gruppe?"
          infoText="Om du velger å spille uten gruppe vil ikke resultatene lagres"
        />
        <div className={styles["toggle-container"]}>
          <div className={styles["toggle-section"]}>
            <Input
              type="toggle"
              onInput={setIsGroupGame}
              initialValue={isGroupGame}
            />
          </div>
        </div>
      </div>
      {isGroupGame && (
        <div>
          <h2 className={styles["title-centered"]}>Velg gruppe</h2>
          <div className={styles["groups-container"]}>
            {groupsWithStatus.data.length > 0 ? (
              <RadioCards
                items={groupsWithStatus.data.map((group, i) => ({
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
      <TitleWithInfo
        title="Velg spill"
        infoText="Velg spillet det skal føres poeng for"
      />
      <div className={styles["groups-container"]}>
        <RadioCards
          items={gameTypes.map((gameType, i) => ({
            title: gameType.emoji + " " + gameType.name,
            key: gameType.id,
          }))}
          selected={selectedGame}
          setSelected={setSelectedGame}
        />
      </div>
      <div>
        <TitleWithInfo
          title="Ønsker du lag?"
          infoText="Ønsker du at deltagerne skal deles inn i lag?"
        />
        <div className={styles["toggle-container"]}>
          <div className={styles["toggle-section"]}>
            <Input
              type="toggle"
              onInput={setAllowTeams}
              initialValue={allowTeams}
            />
          </div>
        </div>
      </div>
      <div>
        <h2 className={styles["title-centered"]}>Velg deltagere</h2>
        <div className={styles["groups-container"]}>
          <CheckboxCards
            items={users.map((user, i) => ({
              title: user.username,
              key: i.toString(),
            }))}
            checked={participants}
            setChecked={setParticipants}
          />
        </div>
      </div>
      <div className={styles["button-container"]}>
        <Button
          variant={ButtonVariant.Round}
          color={ButtonColor.Green}
          onClick={onSubmit}
        >
          Start spill
        </Button>
      </div>
    </PageWrapper>
  );
};

export default CreateGamePage;
