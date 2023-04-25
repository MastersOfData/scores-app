import { Timestamp } from "firebase/firestore";
import { FC, useMemo } from "react";
import { GameAction } from "src/fire-base/models";
import styles from "src/styles/ActionLog.module.css";
import { GameActionType } from "src/types/types";

interface ActionLogProps {
  actions: GameAction[];
}

const mockActions: GameAction[] = [
  {
    gameId: "69",
    actorId: "420",
    actionType: GameActionType.START,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "100",
    value: 40,
  },
  {
    gameId: "69",
    actorId: "421",
    actionType: GameActionType.CONTINUE,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "100",
    value: 50,
  },
  {
    gameId: "69",
    actorId: "422",
    actionType: GameActionType.FINISH,
    timestamp: Timestamp.fromDate(new Date()),
    subjectId: "100",
    value: -10,
  },
];

export const ActionLog: FC<ActionLogProps> = ({ actions }) => {
  const startTime = useMemo(
    () => mockActions[0].timestamp.seconds,
    [mockActions]
  );
  return (
    <table className={styles["table"]}>
      <thead>
        <tr>
          <th>Tid</th>
          <th>Bruker</th>
          <th>Tildeler</th>
          <th>Poeng</th>
        </tr>
      </thead>
      <tbody>
        {mockActions.map((action, index) => (
          <tr key={index} className={styles["tr"]}>
            <td className={styles["td"]}>
              {action.timestamp.seconds - startTime}
            </td>
            <td className={styles["td"]}>Birger</td>
            <td className={styles["td"]}>Birger</td>
            <td className={styles["td"]}>{action.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
