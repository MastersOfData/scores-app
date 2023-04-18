"use client";

import PageWrapper from "src/components/PageWrapper";
import { useGetLiveGame, useUserHasAccessToGame } from "../../store/hooks";
import Spinner from "../../components/Spinner";
import { GameActionType } from "../../types/types";
import { getElapsedTimeStringFromSeconds } from "../../utils/util";

import Styles from "../../styles/Spill.module.css";

export default function TestLiveGame() {
  const gameId = "cb4Xqs6WdfUfKVHHVygm";

  const gameAccess = useUserHasAccessToGame(gameId);
  const live = useGetLiveGame(gameId);

  const elapsedTimeString = getElapsedTimeStringFromSeconds(
    live.elapsedGameTime
  );

  // if (!gameAccess.hasLoaded) {
  //   return <Spinner />;
  // }

  // if (!gameAccess.hasAccess) {
  //   return <p>{gameAccess.noAccessReason}</p>;
  // }

  return (
    <PageWrapper title="Live game test" authenticated={true}>
      <p>{elapsedTimeString}</p>
      <button onClick={() => live.changeGameStatus(GameActionType.START)}>
        Start game
      </button>
      <button onClick={() => live.changeGameStatus(GameActionType.FINISH)}>
        Finish game
      </button>
      <button onClick={() => live.addPoints("[userid]", 3)}>Add points</button>
      <h2>Logg</h2>
      <div>
        <table className={Styles["log"]}>
          <thead>
            <tr>
              <th>Tid</th>
              <th className={Styles["text-align-left"]}>Bruker</th>
              <th className={Styles["text-align-left"]}>Tildeler</th>
              <th>Poeng</th>
            </tr>
          </thead>
          <tbody>
            {live.localGameLog
              .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
              .map((entry, index) => {
                const { subjectId, actorId, timestamp, value } = entry;
                return (
                  <tr key={index + entry.actionType + entry.subjectId}>
                    <td>
                      {getElapsedTimeStringFromSeconds(timestamp.seconds)}
                    </td>
                    <td className={Styles["text-align-left"]}>{subjectId}</td>
                    <td className={Styles["text-align-left"]}>{actorId}</td>
                    <td>{value}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
