"use client";

import PageWrapper from "src/components/PageWrapper";
import { useGetLiveGame, useUserHasAccessToGame } from "../../store/hooks";
import Spinner from "../../components/Spinner";
import { getElapsedTimeStringFromSeconds } from "../../utils/util";

export default function TestLiveGame() {
  const gameId = "Vo90Ls9JIUM45x0aWTrE";

  const gameAccess = useUserHasAccessToGame(gameId);
  const live = useGetLiveGame(gameId);

  const elapsedTimeString = getElapsedTimeStringFromSeconds(
    live.elapsedGameTime
  );

  if (!gameAccess.hasLoaded) {
    return <Spinner />;
  }

  if (!gameAccess.hasAccess) {
    return <p>{gameAccess.noAccessReason}</p>;
  }

  return (
    <PageWrapper title='Live game test' authenticated={true}>
      <p>{elapsedTimeString}</p>
      <button onClick={() => live.startGame()}>Start game</button>
      <button onClick={() => live.finishGame()}>Finish game</button>
      <button
        onClick={() =>
          live.addPoints(
            live.localGameState ? live.localGameState.players[0].playerId : "",
            3
          )
        }
      >
        Add points to {live.localGameState?.players[0].playerId}
      </button>
      <button
        onClick={() =>
          live.addPoints(
            live.localGameState ? live.localGameState.players[1].playerId : "",
            3
          )
        }
      >
        Add points to {live.localGameState?.players[1].playerId}
      </button>
      <p>Next player:</p>
      <p>{live.nextPlayersTurn ?? "undefined"}</p>
      <h2>Log</h2>
      {live.localGameLog
        .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
        .map((log) => (
          <p key={log.id}>
            {log.timestamp.toDate().toLocaleTimeString()},
            {log.actionType.toString()}, {log.value}, {log.subjectId}
          </p>
        ))}
    </PageWrapper>
  );
}
