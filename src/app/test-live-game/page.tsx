"use client";

import PageWrapper from "src/components/PageWrapper";
import { useGetLiveGame, useUserHasAccessToGame } from "../../store/hooks";
import Spinner from "../../components/Spinner";
import { GameActionType } from "../../types/types";
import { getElapsedTimeStringFromSeconds } from "../../utils/util";

export default function TestLiveGame() {
  const gameId = "cb4Xqs6WdfUfKVHHVygm";

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
      <button onClick={() => live.changeGameStatus(GameActionType.START)}>
        Start game
      </button>
      <button onClick={() => live.changeGameStatus(GameActionType.FINISH)}>
        Finish game
      </button>
      <button onClick={() => live.addPoints("[userid]", 3)}>Add points</button>
    </PageWrapper>
  );
}
