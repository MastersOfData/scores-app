"use client";

import React, { FC } from "react";
import PageWrapper from "../../../../components/PageWrapper";
import { useGetGamesForGroup } from "src/store/hooks";
import { DataStatus } from "src/store/store.types";

interface GamePageProps {
  params: { groupdId: string; gameId: string };
}

const GamePage: FC<GamePageProps> = ({ params }) => {
  const { groupdId, gameId } = params;
  const gamesWithStatus = useGetGamesForGroup(groupdId);

  console.log({ gamesWithStatus });

  if (!gamesWithStatus.data || gamesWithStatus.status === DataStatus.LOADING) {
    return <p>Loading...</p>;
  }

  const game = gamesWithStatus.data?.find((game) => game.id === gameId);

  if (!game) {
    return <p>Spill ikke funnet</p>;
  }

  return (
    <PageWrapper title="Spill" backPath="/">
      <p>{`Spill: ${JSON.stringify(game)}`}</p>
    </PageWrapper>
  );
};

export default GamePage;
