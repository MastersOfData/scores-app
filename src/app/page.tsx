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
    .map((game, i) => {
      const diffDays = differenceBetweenFirestoreTimestampsInDays(
        game.timestamp,
        Timestamp.fromDate(new Date())
      );
      return {
        key: i.toString(),
        title: `${diffDays} dager siden`,
        labels: ["Noe relevant info", "Annen info"],
        emoji: "",
      };
    });
  //Must update paths
  return (
    <PageWrapper title='Velkommen!'>
      <div className={styles["buttons-container"]}>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            withLink
            href='/?pressed=profile'
          >
            <PersonIcon />
          </Button>
          <p className={styles.label}>Profil</p>
        </div>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Orange}
            withLink
            href='/play-option'
          >
            <ControllerIcon />
          </Button>
          <p className={styles.label}>Nytt spill</p>
        </div>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Pink}
            withLink
            href='/create-group'
          >
            <GroupIcon />
          </Button>
          <p className={styles.label}>Ny gruppe</p>
        </div>
      </div>
      <h2 className={styles["title-centered"]}>Bli med i en gruppe</h2>
      <div className={styles["group-input-container"]}>
        <Input
          type='text'
          className={styles["text-input"]}
          placeholder='Invitasjons-kode...'
        />
        <Button variant={ButtonVariant.Medium} color={ButtonColor.Red}>
          Bli med
        </Button>
      </div>
      <h2 className={styles.title}>Dine grupper</h2>
      <div className={styles["cards-container"]}>
        <ScrollableLargeCards items={cardItemsGroups} />
      </div>
      <h2 className={styles.title}>Nylige spill</h2>
      <div className={styles["cards-container"]}>
        <ScrollableLargeCards items={cardItemsGames} />
      </div>
    </PageWrapper>
  );
}
