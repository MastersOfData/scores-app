"use client";

import { useState } from "react";
import styles from "src/styles/RegisterResult.module.css";
import PageWrapper from "src/components/PageWrapper";
import { Group, User } from "src/fire-base/models";
import { RadioCards } from "src/components/RadioCards";
import TitleWithInfo from "src/components/TitleWithInfo";
import { CheckboxCards } from "src/components/CheckboxCards";
import Input from "src/components/Input";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { GameType } from "src/types/types";

export default function RegisterResultPage() {
  //Mock groups
  const groups: Group[] = [
    { name: "Bingo-gjengen", emoji: "🎰", games: [], invitationCode: "5673" },
    { name: "Tennis-gutta", emoji: "🎾", games: [], invitationCode: "4822" },
    { name: "Yatzy for life", emoji: "🎲", games: [], invitationCode: "5721" },
  ];

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

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [wantTeams, setWantTeams] = useState<boolean>(false);

  return (
    <PageWrapper title="Registrer resultat" backPath="/play" authenticated={true} >
      <div>
        <h2 className={styles["title-centered"]}>Velg gruppe</h2>
        <div className={styles["groups-container"]}>
          <RadioCards
            items={groups.map((group, i) => ({
              title: group.emoji + " " + group.name,
              key: i.toString(),
            }))}
            selected={selectedGroup}
            setSelected={setSelectedGroup}
          />
        </div>
      </div>
      <TitleWithInfo
        title="Velg spill"
        infoText="Velg typen spill du ønsker å registrere et nytt resultat for."
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
      <TitleWithInfo
        title="Ønsker du lag?"
        infoText="Ønsker du at deltagerne skal deles inn i lag?"
      />
      <div className={styles["toggle-container"]}>
        <div className={styles["toggle-section"]}>
          <Input type="toggle" onInput={setWantTeams} />
        </div>
      </div>
      <TitleWithInfo
        title="Hvem vant?"
        infoText="Flere vinnere kan velges. Alle vinnere får resultat uavgjort mens resten får tap"
      />
      <div className={styles["groups-container"]}>
        <CheckboxCards
          items={users.map((user, i) => ({
            title: user.username,
            key: i.toString(),
          }))}
          checked={winners}
          setChecked={setWinners}
        />
      </div>
      <div className={styles["button-container"]}>
        <Button variant={ButtonVariant.Round} color={ButtonColor.Green}>
          Legg til resultat
        </Button>
      </div>
    </PageWrapper>
  );
}
