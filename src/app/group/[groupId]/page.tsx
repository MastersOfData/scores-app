"use client";

import React, { FC } from "react";
import { ControllerIcon } from "../../../assets/icons/ControllerIcon";
import { PeopleIcon } from "../../../assets/icons/PeopleIcon";
import { ResultsIcon } from "../../../assets/icons/ResultsIcon";
import { Button, ButtonColor, ButtonVariant } from "../../../components/Button";
import PageWrapper from "../../../components/PageWrapper";
import { useGetGroupsForCurrentUser } from "../../../store/hooks";
import { DataStatus } from "../../../store/store.types";
import homeStyles from "../../../styles/Home.module.css";
import styles from "../../../styles/Group.module.css";
import Medal, { MedalType } from "../../../components/Medal";
import { ScrollableLargeCards } from "../../../components/ScrollableLargeCards";
import { CardItem } from "../../../components/Card";
import { mapGameTypesToCardItems } from "../../../utils/util";
import { useRouter } from "next/navigation";

interface GroupPageProps {
  params: { groupId: string };
}

const GroupPage: FC<GroupPageProps> = ({ params }) => {
  const { groupId } = params;
  const groupsWithStatus = useGetGroupsForCurrentUser();
  const router = useRouter();

  if (
    !groupsWithStatus.data ||
    groupsWithStatus.status === DataStatus.LOADING
  ) {
    return <p>Loading...</p>;
  }

  const group = groupsWithStatus.data?.find((group) => group.id === groupId);

  if (!group) {
    return <p>Ingen tilgang</p>;
  }

  const gameHistoryMock: CardItem[] = [
    {
      key: "1",
      title: "2 dager siden",
      labels: ["Yatzy", "Ikke fullført"],
      emoji: "🎲",
    },
    {
      key: "2",
      title: "8 dager siden",
      labels: ["Tennis", "Lars vant! 🎉"],
      emoji: "🎾",
    },
  ];

  return (
    <PageWrapper title={group.name} backPath='/'>
      <div className={homeStyles["buttons-container"]}>
        <div className={homeStyles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Green}
            withLink
            href='/'
          >
            <ResultsIcon />
          </Button>
          <p className={homeStyles.label}>Registrer resultat</p>
        </div>
        <div className={homeStyles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Orange}
            withLink
            href='/'
          >
            <ControllerIcon />
          </Button>
          <p className={homeStyles.label}>Start spill</p>
        </div>
        <div className={homeStyles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Pink}
            withLink
            href='/'
          >
            <PeopleIcon />
          </Button>
          <p className={homeStyles.label}>Administrer medlemmer</p>
        </div>
      </div>
      <div className={styles["section-container"]}>
        <h2>Leaderboard</h2>
        <div className={styles["spacing"]} />
        <table className={styles["leaderboard"]}>
          <thead>
            <tr>
              <th>#</th>
              <th className={styles["text-align-left"]}>Bruker</th>
              <th>P</th>
              <th className={styles["wins-col"]}>W</th>
              <th className={styles["draws-col"]}>D</th>
              <th className={styles["losses-col"]}>L</th>
              <th>W%</th>
            </tr>
          </thead>
          <tbody>
            {group.members.map((member, index) => {
              const gamesPlayed = member.wins + member.draws + member.losses;
              return (
                <tr key={member.id}>
                  <td>
                    {index < 3 ? (
                      <Medal type={Object.values(MedalType)[index]} />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className={styles["text-align-left"]}>
                    {member.username}
                  </td>
                  <td>{gamesPlayed}</td>
                  <td className={styles["wins-col"]}>{member.wins}</td>
                  <td className={styles["draws-col"]}>{member.draws}</td>
                  <td className={styles["losses-col"]}>{member.losses}</td>
                  <td>
                    {gamesPlayed
                      ? ((member.wins / gamesPlayed) * 100).toFixed(0)
                      : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles["section-container"]}>
          <h2>Spillhistorikk</h2>
          <div className={styles["spacing"]} />
          <ScrollableLargeCards items={gameHistoryMock} />
        </div>
        <div className={styles["section-container"]}>
          <h2>Egendefinerte spill</h2>
          <div className={styles["spacing"]} />
          <ScrollableLargeCards
            items={mapGameTypesToCardItems(group.gameTypes, () =>
              router.push(`group/${groupId}/newGameType`)
            )}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default GroupPage;
