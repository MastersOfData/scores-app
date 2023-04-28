"use client";

import { FC, useEffect, useState } from "react";
import { Card } from "src/components/Card";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "src/components/PageWrapper";
import CardStyles from "src/styles/Card.module.css";
import SpillStyles from "src/styles/Spill.module.css";
import {
  useGetGroupsForCurrentUser,
  useUserHasAccessToGame,
  useGetLiveGame,
} from "src/store/hooks";
import GroupStyles from "src/styles/Group.module.css";
import { getElapsedTimeStringFromSeconds } from "src/utils/util";
import Medal, { MedalType } from "src/components/Medal";
import { RadioCards } from "src/components/RadioCards";
import RegResultStyles from "src/styles/RegisterResult.module.css";
import {
  getMultipleUsernamesFromIds,
  useUser,
} from "src/services/user.service";

import Input from "src/components/Input";
import { DataStatus } from "../../../store/store.types";
import Spinner from "../../../components/Spinner";
import { useRouter } from "next/navigation";
import { ActionLog } from "src/components/ActionLog";

interface GameScreenProps {
  params: { gameId: string };
}

const GameScreen: FC<GameScreenProps> = ({ params }) => {
  const router = useRouter();
  const { gameId } = params;

  const { user } = useUser();
  const access = useUserHasAccessToGame(gameId);

  const liveGame = useGetLiveGame(gameId);
  const groupsWithStatus = useGetGroupsForCurrentUser();

  const [isGroupGame] = useState(true);
  const [expression, setExpression] = useState<string>("");
  // const inputFieldRef = useRef<HTMLInputElement>(null);

  const [usernameMap, setUsernameMap] = useState<
    Map<string, string | undefined>
  >(new Map());

  useEffect(() => {
    if (liveGame.gameIsFinished()) {
      router.push(`/game/${gameId}/result`);
    }
  }, [gameId, liveGame, liveGame.localGameLog, router]);

  useEffect(() => {
    if (liveGame.localGameState?.players) {
      getMultipleUsernamesFromIds(
        liveGame.localGameState.players.map((p) => p.playerId)
      ).then((map) => setUsernameMap(map));
    }
  }, [liveGame.localGameState?.players]);

  if (
    user &&
    (!access.hasLoaded ||
      groupsWithStatus.status === DataStatus.LOADING ||
      groupsWithStatus.data === undefined ||
      usernameMap.size === 0)
  ) {
    return <Spinner />;
  }

  const group = groupsWithStatus.data?.find(
    (group) => group.id === liveGame.localGameState?.groupId
  );

  if (!user) {
    return <PageWrapper title='' backPath='/' authenticated />;
  }

  if (!group) {
    return (
      <div className='center-items'>
        <p>Gruppen finnes ikke! 🚨</p>
      </div>
    );
  }

  if (!access.hasAccess) {
    return <p>{access.noAccessReason}</p>;
  }

  const gameType = group.gameTypes?.find(
    (gameType) => gameType.id === liveGame.localGameState?.gameTypeId
  );

  const calcExpr = () => {
    const mathExpr = expression.replace("×", "*").replace("÷", "/");
    try {
      const nextPlayer = liveGame.nextPlayersTurn;
      if (nextPlayer) {
        const newScore = Number(eval(mathExpr).toString());
        liveGame.addPoints(nextPlayer, newScore);
        setExpression("");
      } else {
        alert("User has not been defined!");
      }
    } catch (err) {
      alert("Not a valid expression!");
    }
  };

  const setExpressionAndFocusOnInput = (newExpr: string) => {
    setExpression(expression + newExpr);
    // inputFieldRef.current?.focus();
  };

  return (
    <PageWrapper title='Spill' backPath='/' authenticated={true}>
      <div className={SpillStyles["header-cards"]}>
        <Card
          title={
            gameType
              ? `${gameType?.emoji} ${gameType?.name}`
              : "Ukjent spilltype"
          }
        />
        <div className={`${CardStyles["card"]} ${SpillStyles["time-card"]}`}>
          <div className={CardStyles["card-header-wrapper"]}>
            <h4
              className={`${CardStyles["card-title"]} ${SpillStyles.timeLabel} `}
            >
              {getElapsedTimeStringFromSeconds(liveGame.elapsedGameTime)}
            </h4>
          </div>
        </div>
      </div>

      <table className={GroupStyles["leaderboard"]}>
        <thead>
          <tr>
            <th>#</th>
            <th className={GroupStyles["text-align-left"]}>Bruker</th>
            <th>Poeng</th>
          </tr>
        </thead>
        <tbody>
          {liveGame.localGameState?.players
            .sort((a, b) => b.points - a.points)
            .map((member, index) => {
              const score = liveGame.scores.find(
                (u) => u.playerId === member.playerId
              );
              return (
                <tr key={member.playerId}>
                  <td>
                    {index < 3 ? (
                      <Medal type={Object.values(MedalType)[index]} />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className={GroupStyles["text-align-left"]}>
                    {usernameMap.get(member.playerId) ?? member.playerId}
                  </td>
                  <td>{score ? score.points : "-"}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className={GroupStyles["spacing"]} />

      {
        // START: Show when game has started
        liveGame.gameHasStarted() && (
          <div>
            <h2 className={RegResultStyles["title-centered"]}>
              Oppdater poeng
            </h2>
            {isGroupGame ? (
              <div>
                <div className={RegResultStyles["groups-container"]}>
                  <RadioCards
                    items={liveGame.localGameState?.players.map((player) => ({
                      title:
                        usernameMap.get(player.playerId) ?? player.playerId,
                      key: player.playerId,
                    }))}
                    selected={liveGame.nextPlayersTurn ?? ""}
                    setSelected={() => 1}
                  />
                </div>
              </div>
            ) : (
              // <RadioCards
              //   items={userArr.map((user, i) => ({
              //     title: user.toString(),
              //     key: user.toString(),
              //   }))}
              //   selected={selectedUser}
              //   setSelected={setSelectedUser}
              // />
              <></>
            )}

            <div className={SpillStyles["calculator-container"]}>
              <Input
                placeholder='Legg til poeng...'
                type={"text"}
                value={expression}
                className={SpillStyles["text-input"]}
                onInput={setExpression}
              />
              <div className={SpillStyles["math-buttonsContainer"]}>
                <Button
                  className={SpillStyles["operator-button"]}
                  variant={ButtonVariant.Round}
                  color={ButtonColor.Grey}
                  onClick={() => setExpressionAndFocusOnInput(" + ")}
                >
                  +
                </Button>
                <Button
                  className={SpillStyles["operator-button"]}
                  variant={ButtonVariant.Round}
                  color={ButtonColor.Grey}
                  onClick={() => setExpressionAndFocusOnInput(" - ")}
                >
                  -
                </Button>
                <Button
                  className={SpillStyles["operator-button"]}
                  variant={ButtonVariant.Round}
                  color={ButtonColor.Grey}
                  onClick={() => setExpressionAndFocusOnInput(" × ")}
                >
                  ×
                </Button>
                <Button
                  className={SpillStyles["operator-button"]}
                  variant={ButtonVariant.Round}
                  color={ButtonColor.Grey}
                  onClick={() => setExpressionAndFocusOnInput(" ÷ ")}
                >
                  ÷
                </Button>
              </div>
              <Button
                className={SpillStyles["calculate-button"]}
                variant={ButtonVariant.Medium}
                color={ButtonColor.Red}
                onClick={calcExpr}
              >
                Regn ut
              </Button>
            </div>
          </div>
        )
        // END: Show when game has started
      }

      <div className='center-items'>
        {!liveGame.gameHasStarted() && (
          <>
            <div className={GroupStyles["spacing"]} />
            <div className={GroupStyles["spacing"]} />
            <Button
              variant={ButtonVariant.Round}
              color={ButtonColor.Green}
              onClick={liveGame.startGame}
            >
              Start spill
            </Button>
          </>
        )}
        {liveGame.gameHasStarted() && !liveGame.gameIsFinished() && (
          <Button
            variant={ButtonVariant.Round}
            color={ButtonColor.Green}
            onClick={liveGame.finishGame}
          >
            Fullfør spill
          </Button>
        )}
        {liveGame.gameIsFinished() && (
          <Button
            variant={ButtonVariant.Round}
            color={ButtonColor.Green}
            href={`/game/${gameId}/result`}
            withLink={true}
          >
            Se resultat
          </Button>
        )}
        <ActionLog actions={liveGame.localGameLog} usernameMap={usernameMap} />
      </div>
    </PageWrapper>
  );
};

export default GameScreen;
