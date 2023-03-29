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

const CreateGamePage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const groupsWithStatus = useGetGroupsForCurrentUser();

  //Dont have a type for this
  type GameType = {
    name: string;
    emoji: string;
  };

  //Mock games
  const gameTypes: GameType[] = [
    { name: "Bingo", emoji: "🎰" },
    { name: "Tennis", emoji: "🎾" },
    { name: "Yatzy", emoji: "🎲" },
  ];

  //Mock users
  const users: User[] = [
    { email: "birger@gmail.com", username: "xXbirgerXx" },
    { email: "lars@gmail.com", username: "lars123" },
    { email: "anders@gmail.com", username: "mr_bean" },
  ];

  const [isGroupGame, setIsGroupGame] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [allowTeams, setAllowTeams] = useState<boolean>(false);

  const onSubmit = async () => {
    const game = await dispatch(
      createGameAction({
        gameData: {
          groupId: selectedGroup,
          gameTypeId: selectedGame,
          allowTeams: allowTeams,
          participants: participants,
        }
      })
    ).unwrap();

    router.push(`game/${game.id}`);
  }

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
                  key: i.toString(),
                }))}
                selected={selectedGroup}
                setSelected={setSelectedGroup}
              />
            ) : (
              <p>Du er ikke medlem i noen grupper eller så finner vi ikke gruppene dine for øyeblikket.</p>
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
            key: i.toString(),
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
}

export default CreateGamePage;