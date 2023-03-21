"use client";

import styles from "../styles/Home.module.css";
import { ControllerIcon } from "src/assets/icons/ControllerIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { PersonIcon } from "src/assets/icons/PersonIcon";
import { GroupIcon } from "src/assets/icons/GroupIcon";
import Input from "src/components/Input";
import { ScrollableLargeCards } from "src/components/ScrollableLargeCards";
import { Game, Group } from "src/fire-base/models";
import { CardItem } from "src/components/Card";
import { Timestamp } from "firebase/firestore";
import { differenceBetweenFirestoreTimestampsInDays } from "src/utils/util";
import Link from "next/link";
import PageWrapper from "src/components/PageWrapper";

export default function Home() {

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
      timestamp: Timestamp.fromDate(new Date(2023, 2, 21)),
      state: "ONGOING",
    },
    {
      gameTypeId: "420",
      groupId: "69",
      players: ["2", 69],
      winner: "3",
      timestamp: Timestamp.fromDate(new Date(2023, 2, 18)),
      state: "FINISHED",
    },
    {
      gameTypeId: "69",
      groupId: "420",
      players: ["4", 420],
      winner: "5",
      timestamp: Timestamp.fromDate(new Date(2023, 2, 10)),
      state: "FINISHED",
    },
  ];

  const cardItemsGames: CardItem[] = games
    .filter((game) => game.state == "FINISHED")
    .map((game) => {
      const diffDays = differenceBetweenFirestoreTimestampsInDays(
        game.timestamp,
        Timestamp.fromDate(new Date())
      );
      return {
        key: game.winner!,
        title: `${diffDays} dager siden`,
        labels: ["Noe relevant info", "Annen info"],
        emoji: "",
      };
    });
  //Must update paths
  return (
    <PageWrapper title="Velkommen">
      <div className={styles["buttons-container"]}>
        <div className={styles["button-container"]}>
          <Link href="/?pressed=profile">
            <Button variant={ButtonVariant.Action}>
              <PersonIcon />
            </Button>
          </Link>
          <p className={styles.label}>Profil</p>
        </div>
        <div className={styles["button-container"]}>
          <Link href="/?pressed=new_game">
            <Button variant={ButtonVariant.Action} color={ButtonColor.Orange}>
              <ControllerIcon />
            </Button>
          </Link>
          <p className={styles.label}>Nytt spill</p>
        </div>
        <div className={styles["button-container"]}>
          <Link href="/?pressed=new_group">
            <Button variant={ButtonVariant.Action} color={ButtonColor.Pink}>
              <GroupIcon />
            </Button>
          </Link>
          <p className={styles.label}>Ny gruppe</p>
        </div>
      </div>
      <p className={styles["title-centered"]}>Bli med i en gruppe</p>
      <div className={styles["group-input-container"]}>
        <Input type="text" className={styles["text-input"]} />
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
    </PageWrapper>
  );
}
