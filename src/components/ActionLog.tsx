import { FC } from "react";
import { GameAction } from "src/fire-base/models";
import styles from "src/styles/ActionLog.module.css";
import { formatSeconds } from "src/utils/util";
import { GameActionType } from "../types/types";

interface ActionLogProps {
  actions: GameAction[];
  usernameMap: Map<string, string | undefined>;
}

export const ActionLog: FC<ActionLogProps> = ({ actions, usernameMap }) => {
  const startTime = actions.find(
    (action) => action.actionType === GameActionType.START
  )?.timestamp.seconds;

  if (!startTime) {
    return null;
  }

  const sortedActions = actions.sort(
    (a, b) => b.timestamp.seconds - a.timestamp.seconds
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
            {sortedActions.map((action, index) => {
              const isStartOrFinishAction =
                action.actionType == GameActionType.START ||
                action.actionType == GameActionType.FINISH;

              if (isStartOrFinishAction) {
                return (
                  <tr key={index} className={styles["tr"]}>
                    <td className={styles["td"]}>
                      {formatSeconds(action.timestamp.seconds - startTime)}
                    </td>
                    <td
                      className={`${styles["td"]} ${styles["start-or-end-td"]}`}
                      colSpan={3}
                    >
                      {action.actionType === GameActionType.START
                        ? "Start"
                        : "Slutt"}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={index} className={styles["tr"]}>
                  <td className={styles["td"]}>
                    {formatSeconds(action.timestamp.seconds - startTime)}
                  </td>
                  <td className={styles["td"]}>
                    {action.subjectId ? usernameMap.get(action.subjectId) : ""}
                  </td>
                  <td className={styles["td"]}>
                    {action.actorId ? usernameMap.get(action.actorId) : ""}
                  </td>
                  {action.value !== undefined && action.value > 0 ? (
                    <td
                      className={`${styles["td"]} ${styles["positive-value"]}`}
                    >
                      {`+${action.value}`}
                    </td>
                  ) : (
                    <td
                      className={`${styles["td"]} ${styles["negative-value"]}`}
                    >
                      {action.value}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
