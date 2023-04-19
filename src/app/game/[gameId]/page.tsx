"use client";

import { FC, useState } from "react";
import { Card } from "src/components/Card";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "src/components/PageWrapper";
import CardStyles from "src/styles/Card.module.css";
import ButtonStyles from "src/styles/Button.module.css";
import GameStyles from "src/styles/Spill.module.css";
import {
  useGetGroupsForCurrentUser,
  useUserHasAccessToGame,
  useGetLiveGame,
} from "src/store/hooks";
import GroupStyles from "src/styles/Group.module.css";
import {
  calculateGroupLeaderboard,
  getElapsedTimeStringFromSeconds,
} from "src/utils/util";
import Medal, { MedalType } from "src/components/Medal";
import { RadioCards } from "src/components/RadioCards";
import RegResultStyles from "src/styles/RegisterResult.module.css";
import { useUser } from "src/services/user.service";
import { useGetGameById } from "src/store/hooks";

import Input from "src/components/Input";
import { getUserId } from "src/services/user.service";
import { DataStatus } from "../../../store/store.types";
import Spinner from "../../../components/Spinner";
import { useRouter, useSearchParams } from "next/navigation";

interface GameScreenProps {
  params: { gameId: string };
}

const GameScreen: FC<GameScreenProps> = ({ params }) => {
  const router = useRouter();
  const { gameId } = params;
  const access = useUserHasAccessToGame(gameId);

  //Skummelt å loade inn game før vi vet om en bruker has access?
  const gamesWithStatus = useGetGameById(gameId);
  const game = gamesWithStatus.data;

  const userContext = useUser();
  const user = userContext.userData;
  const operators = ["+", "-", "×", "÷"];

  const groupsWithStatus = useGetGroupsForCurrentUser();

  const liveGame = useGetLiveGame(gameId);

  //Hooks
  const [selectedUser, setSelectedUser] = useState<string | undefined>("");
  const [isGroupGame, setIsGroupGame] = useState(true);
  const [expression, setExpression] = useState<string>("");
  const [currentUserPoints, setCurrentUserPoints] = useState<string>("");

  if (
    user &&
    (groupsWithStatus.status === DataStatus.LOADING ||
      !access.hasLoaded ||
      groupsWithStatus.data === undefined ||
      gamesWithStatus.status === DataStatus.LOADING ||
      gamesWithStatus.data === undefined)
  ) {
    return <Spinner />;
  }

  if (!access.hasAccess) {
    return <p>{access.noAccessReason}</p>;
  }
  //Kan en se denne siden uten å logge inn?
  if (user === null) {
    return <div />;
  }
  //NOT DONE
  if (game === undefined) {
    return <div />;
  }

  const userArr = [user];

  const group = groupsWithStatus.data?.find(
    (group) => group.id === game.groupId
  );

  const calcExpr = () => {
    const mathExpr = expression.replace("×", "*").replace("÷", "/");
    try {
      if (selectedUser) {
        const newScore = eval(mathExpr).toString();
        liveGame.addPoints(selectedUser, newScore);
        setExpression(newScore);
      } else {
        alert("User has not been defined!");
      }
    } catch (err) {
      console.log(err);
      alert("Not a valid expression!");
    }
  };

  async function setUserPoints(username: string): Promise<void> {
    console.log("SetUserPoints");
    if (game === undefined) {
      return;
    }
    //Get score from user and setExpression(score)

    setSelectedUser(username);

    const userId = await getUserId(username);
    if (userId === undefined) {
      return;
    }

    for (const score of game.players) {
      if (score.playerId === userId) {
        setExpression(score.toString());
        break;
      }
    }
  }

  if (!group) {
    return (
      <PageWrapper title="" backPath="/" authenticated>
        <div className="center-items">
          <p>Gruppen finnes ikke! 🚨</p>
        </div>
      </PageWrapper>
    );
  }

  const gameEmoji = "😂";
  const gameTitle = gameEmoji + "Tennis";
  const time = "13:37";
  const groupMember = ["Tore", "Tang"];

  const leaderboardStats = calculateGroupLeaderboard(group.members);

  const onSubmit = () => {
    console.log("It is submitted");
  };

  return (
    <PageWrapper title="Spill" backPath="/" authenticated={true}>
      <div className={GameStyles["header-cards"]}>
        <Card title={gameTitle} />
        <div
          className={`${CardStyles["card"]} 
                            ${ButtonStyles["button--green"]}`}
        >
          <div className={CardStyles["card-header-wrapper"]}>
            <h4
              className={`${CardStyles["card-title"]} ${GameStyles.timeLabel} `}
            >
              {time}
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
          {leaderboardStats.map((member, index) => {
            return (
              <tr key={member.userId}>
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
                <td>{member.wins}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2 className={RegResultStyles["title-centered"]}>Oppdater poeng</h2>
      {isGroupGame ? (
        <div>
          <div className={RegResultStyles["groups-container"]}>
            <RadioCards
              items={group.members.map((user, i) => ({
                title: user.username,
                key: user.id,
              }))}
              selected={selectedUser}
              setSelected={setUserPoints}
            />
          </div>
        </div>
      ) : (
        <RadioCards
          items={userArr.map((user, i) => ({
            title: user.toString(),
            key: user.toString(),
          }))}
          selected={selectedUser}
          setSelected={setSelectedUser}
        />
      )}
      <div className={GameStyles["calculator-container"]}>
        <Input
          placeholder="Legg til poeng..."
          type={"text"}
          value={expression}
          className={GameStyles["text-input"]}
          onInput={setExpression}
        />

        <div className={GameStyles["math-buttonsContainer"]}>
          <Button
            className={GameStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " + ")}
          >
            +
          </Button>
          <Button
            className={GameStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " - ")}
          >
            -
          </Button>
          <Button
            className={GameStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " × ")}
          >
            ×
          </Button>
          <Button
            className={GameStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " ÷ ")}
          >
            ÷
          </Button>
        </div>
        <Button
          className={GameStyles["calculate-button"]}
          variant={ButtonVariant.Medium}
          color={ButtonColor.Red}
          onClick={calcExpr}
        >
          Regn ut
        </Button>
      </div>
      {liveGame.localGameLog.length > 0 ? (
        <>
          <h2 className={RegResultStyles["title-centered"]}>Logg</h2>
          <table className={GameStyles["log"]}>
            <thead>
              <tr>
                <th>Tid</th>
                <th className={GameStyles["text-align-left"]}>Bruker</th>
                <th className={GameStyles["text-align-left"]}>Tildeler</th>
                <th>Handling</th>
                <th>Poeng</th>
              </tr>
            </thead>
            <tbody>
              {liveGame.localGameLog.map((entry, index) => {
                const { subjectId, actorId, timestamp, value } = entry;
                const hasValue = !!value;
                const isPositive = hasValue && value > 0;

                return (
                  <tr key={index + entry.actionType + entry.subjectId}>
                    <td>{timestamp.seconds}</td>
                    <td className={GameStyles["text-align-left"]}>
                      {group?.members.find((m) => m.id === subjectId)?.username}
                    </td>
                    <td className={GameStyles["text-align-left"]}>
                      {group?.members.find((m) => m.id === actorId)?.username}
                    </td>
                    <td>{entry.actionType}</td>
                    <td
                      className={
                        GameStyles[
                          isPositive
                            ? "positive-number"
                            : "negative-number"
                        ]
                      }
                    >
                      {`${isPositive ? "+" : "-"} ${
                        hasValue ? Math.abs(value) : ""
                      }`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : null}
      <Button
        variant={ButtonVariant.Round}
        color={ButtonColor.Green}
        onClick={onSubmit}
      >
        Start spill
      </Button>
    </PageWrapper>
  );
};

export default GameScreen;
