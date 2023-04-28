"use client";

import Spinner from "src/components/Spinner";
import styles from "src/styles/GameResult.module.css";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { CenteredSmallCards } from "src/components/CenteredSmallCards";
import { CardItemSmall } from "src/components/Card";
import { useGameData } from "src/services/game.service";
import { GameActionType } from "src/types/types";
import { useGetGroupsForCurrentUser } from "../../../../store/hooks";
import { DataStatus } from "../../../../store/store.types";
import GroupStyles from "src/styles/Group.module.css";
import Medal, { MedalType } from "../../../../components/Medal";

export type GameResultProps = {
  gameId: string;
};

export default function GameResult({ gameId }: GameResultProps) {
  const { game, loading } = useGameData(gameId);
  const groups = useGetGroupsForCurrentUser();

  if (loading || groups.status === DataStatus.LOADING) return <Spinner />;

  if (!game) return <p>Something went wrong!</p>;

  const group = groups.data?.find((g) => g.id === game.group?.id);
  const gameType =
    group && group.gameTypes?.find((gt) => gt.id === game.gameType);

  const timestampStr = Intl.DateTimeFormat("no").format(game.timestamp);
  const groupNameStr = game.group
    ? `${game.group?.emoji} ${game.group?.name}`
    : null;

  const gameItems: CardItemSmall[] = [
    {
      key: "time",
      title: `${timestampStr}`,
    },
  ];

  if (gameType) {
    gameItems.push({
      key: "gameType",
      title: `${gameType.emoji} ${gameType?.name}`,
    });
  }

  const winnerItems: CardItemSmall[] = game.winners.map((winner) => ({
    key: winner.id,
    title: winner.username,
  }));

  if (groupNameStr) {
    gameItems.push({
      key: "group",
      title: groupNameStr,
    });
  }

  return (
    <div className={styles.wrapper}>
      <CenteredSmallCards items={gameItems} />
      <div className={styles["winner-wrapper"]}>
        <div className={"center-items"}>
          <h2>Vinner 🎉</h2>
        </div>
        <CenteredSmallCards items={winnerItems} />
      </div>
      <Button
        variant={ButtonVariant.Round}
        color={ButtonColor.Pink}
        withLink={true}
        href='/'
      >
        Tilbake til hjem
      </Button>
      <div style={{ width: "100%" }}>
        <h2>Leaderboard</h2>
        <div>
          <table className={GroupStyles["leaderboard"]}>
            <thead>
              <tr>
                <th>#</th>
                <th className={GroupStyles["text-align-left"]}>Bruker</th>
                <th>Poeng</th>
              </tr>
            </thead>
            <tbody>
              {game.players
                .sort((a, b) => b.points - a.points)
                .map((member, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {index < 3 ? (
                          <Medal type={Object.values(MedalType)[index]} />
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className={GroupStyles["text-align-left"]}>
                        {member.username}
                      </td>
                      <td>{member.points}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className={GroupStyles["spacing"]} />
        <h2>Logg</h2>
        <ul className={styles["actions-list"]}>
          {game.gameActions
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            .map((action, index) => {
              const text = `
              ${
                action.actionType === GameActionType.ADD_POINTS
                  ? `la til ${action.value} poeng for ${action.subject?.username}`
                  : ""
              }
              ${
                action.actionType === GameActionType.START
                  ? "startet spillet"
                  : ""
              }
              ${
                action.actionType === GameActionType.FINISH
                  ? "avsluttet spillet"
                  : ""
              }
              ${
                action.actionType === GameActionType.PAUSE
                  ? "satte spillet på pause"
                  : ""
              }
              ${
                action.actionType === GameActionType.CONTINUE
                  ? "fortsatte spillet"
                  : ""
              }
            `;
              return (
                <li key={`game-action-${index}`}>
                  <strong>{action.actor?.username}</strong> {text}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
