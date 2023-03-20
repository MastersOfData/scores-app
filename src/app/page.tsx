"use client";

import styles from "../styles/Home.module.css";
import { useHeader } from "src/components/Header";
import { ControllerIcon } from "src/assets/icons/ControllerIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { PersonIcon } from "src/assets/icons/PersonIcon";
import { GroupIcon } from "src/assets/icons/GroupIcon";
import Input from "src/components/Input";
import { ScrollableLargeCards } from "src/components/ScrollableLargeCards";
import { Game, Group } from "src/fire-base/models";
import { CardItem } from "src/components/Card";
import { Timestamp } from "firebase/firestore";

export default function Home() {
  useHeader("Velkommen!", "/");

  //Mock groups
  const groups: Group[] = [
    { name: "SnømannGutta", emoji: "⛄", games: [], invitationCode: "5673" },
    { name: "GolfGjengen", emoji: "⛳", games: [], invitationCode: "4822" },
    { name: "BasketBALLERS", emoji: "⛹", games: [], invitationCode: "5721" },
    { name: "Pubgruppen", emoji: "✨", games: [], invitationCode: "9031" },
  ];

  const cardItemsGroups: CardItem[] = groups.map((group) => {
    return {
      key: group.invitationCode,
      title: group.name,
      labels: ["Noe relevant info", "Annen info"],
      emoji: group.emoji,
    };
  });

  //Mock games
  const games: Game[] = [
    {
      gameTypeId: "69",
      groupId: "420",
      players: ["1", 50],
      winner: "1",
      timestamp: Timestamp.now(),
      state: "ONGOING",
    },
    {
      gameTypeId: "420",
      groupId: "69",
      players: ["2", 69],
      winner: "3",
      timestamp: Timestamp.now(),
      state: "FINISHED",
    },
    {
      gameTypeId: "69",
      groupId: "420",
      players: ["4", 420],
      winner: "5",
      timestamp: Timestamp.now(),
      state: "FINISHED",
    },
  ];

  const cardItemsGames: CardItem[] = games
    .filter((game) => game.state == "FINISHED")
    .map((game) => {
      return {
        key: game.winner!,
        title: "2 dager siden",
        labels: ["Noe relevant info", "Annen info"],
        emoji: "",
      };
    });

  return (
    <main className={styles.container}>
      <div className={styles["buttons-container"]}>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action}>
            <PersonIcon />
          </Button>
          <p className={styles.label}>Profil</p>
        </div>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action} color={ButtonColor.Orange}>
            <ControllerIcon />
          </Button>
          <p className={styles.label}>Nytt spill</p>
        </div>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action} color={ButtonColor.Pink}>
            <GroupIcon />
          </Button>
          <p className={styles.label}>Ny gruppe</p>
        </div>
      </div>
      <p className={styles["title-centered"]}>Bli med i en gruppe</p>
      <div className={styles["group-input-container"]}>
        <Input type='text' className={styles["text-input"]} />
        <Button variant={ButtonVariant.Medium} color={ButtonColor.Red}>
          Bli med
        </Button>
      </div>
      <p className={styles.title}>Dine grupper</p>
      <div className={styles["cards-container"]}>
        <ScrollableLargeCards items={cardItemsGroups} />
      </div>
      <p className={styles.title}>Nylige spill</p>
      <div className={styles["cards-container"]}>
        <ScrollableLargeCards items={cardItemsGames} />
      </div>
    </main>
  );
}
