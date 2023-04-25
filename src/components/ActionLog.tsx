import { Timestamp } from "firebase/firestore";
import { FC, useMemo } from "react";
import { GameAction } from "src/fire-base/models";
import styles from "src/styles/ActionLog.module.css";
import { GameActionType } from "src/types/types";
import { formatSeconds } from "src/utils/util";

interface ActionLogProps {
  actions: GameAction[];
}

const mockActions: GameAction[] = [
  {
    gameId: "69",
    actorId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    actionType: GameActionType.START,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    value: 40,
  },
  {
    gameId: "69",
    actorId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    actionType: GameActionType.CONTINUE,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    value: 50,
  },
  {
    gameId: "69",
    actorId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    actionType: GameActionType.FINISH,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    value: -10,
  },
  {
    gameId: "69",
    actorId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    actionType: GameActionType.FINISH,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    value: -10,
  },
  {
    gameId: "69",
    actorId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    actionType: GameActionType.FINISH,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    value: -10,
  },
  {
    gameId: "69",
    actorId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    actionType: GameActionType.FINISH,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "7Om4PoQLCbdQOIhatXZAlfzABdF2",
    value: -10,
  },
];

export const ActionLog: FC<ActionLogProps> = ({ actions }) => {
  const startTime = useMemo(
    () => mockActions[0].timestamp.seconds,
    [mockActions]
  );
  return (
    <div className={styles.container}>
      <h2>Spillogg</h2>
      <div className={styles["log-wrapper"]}>
        <table className={styles["table"]}>
          <thead className={styles["thead"]}>
            <tr>
              <th className={styles["th"]}>Tid</th>
              <th className={styles["th"]}>Bruker</th>
              <th className={styles["th"]}>Tildeler</th>
              <th className={styles["th"]}>Poeng</th>
            </tr>
          </thead>
          <tbody className={styles["tbody"]}>
            {mockActions.map((action, index) => (
              <tr key={index} className={styles["tr"]}>
                <td className={styles["td"]}>
                  {formatSeconds(action.timestamp.seconds - startTime)}
                </td>
                <td className={styles["td"]}>Birger</td>
                <td className={styles["td"]}>Birger</td>
                {action.value && (
                  <td className={styles["td"]}>
                    {action.value > 0 ? (
                      <p
                        className={styles["positive-value"]}
                      >{`+${action.value}`}</p>
                    ) : (
                      <p className={styles["negative-value"]}>{action.value}</p>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
