"use client";

import { FC, useEffect, useState } from "react";
import { Card } from "src/components/Card";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "src/components/PageWrapper";
import CardStyles from "src/styles/Card.module.css";
import ButtonStyles from "src/styles/Button.module.css";
import SpillStyles from "src/styles/Spill.module.css";
import {
  useGetGroupsForCurrentUser,
  useUserHasAccessToGame,
  useGetLiveGame,
} from "src/store/hooks";
import GroupStyles from "src/styles/Group.module.css";
import { calculateGroupLeaderboard } from "src/utils/util";
import Medal, { MedalType } from "src/components/Medal";
import { RadioCards } from "src/components/RadioCards";
import RegResultStyles from "src/styles/RegisterResult.module.css";
import { useUser, getUserName } from "src/services/user.service";
import { useGetGameById } from "src/store/hooks";

import Input from "src/components/Input";
import { getUserId } from "src/services/user.service";
import { DataStatus } from "../../../store/store.types";
import Spinner from "../../../components/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { ActionLog } from "src/components/ActionLog";
import { PlayerScore } from "src/types/types";
import { mapUserIdToName } from "src/utils/util";

interface GameScreenProps {
  params: { gameId: string };
}



const GameScreen: FC<GameScreenProps> = ({ params }) => {
  const router = useRouter();
  const { gameId } = params;
  const access = useUserHasAccessToGame(gameId);

  //Skummelt å loade inn game før vi vet om en bruker has access?
  const gamesWithStatus = useGetGameById(gameId);
  

  const userContext = useUser();
  const user = userContext.userData;

  

  const liveGame = useGetLiveGame(gameId);
  const game = liveGame?.localGameState;



  //Hooks
  const [selectedUser, setSelectedUser] = useState<string | undefined>("");
  const [isGroupGame, setIsGroupGame] = useState(true);
  const [expression, setExpression] = useState<string>("");
  const [scoreBoard, setScoreBoard] = useState<scoreBoard[]>([]);
  const [userNameMap, setUserNameMap] = useState<({
                                                  playerId: string;
                                                  playerName: string;
                                                  } | undefined)[]>([undefined]);

  useEffect(() => {
    const getUserNames =  () => {
      if (liveGame.localGameState?.players) {
        const names = mapUserIdToName(liveGame.localGameState.players.map(x=>x.playerId)).then(data => setUserNameMap(data));

        
      }
    }
  })
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

  if (liveGame === undefined || liveGame === null) {
    return <div />;
  }
  

    //NOT DONE
    if (game === undefined || game === null) {
      return <div />;
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


  if (!access.hasAccess) {
    return <p>{access.noAccessReason}</p>;
  }
  //Kan en se denne siden uten å logge inn?
  if (user === null) {
    return <div />;
  }

  const scores : PlayerScore[] = liveGame.scores;
 
  const board = await mapMemberScoresToScoreBoard(group.members, scores);


  if (scoreBoard.length === 0){
    setScoreBoard(board)
  }
  const userArr = [user];

  console.log(scoreBoard)


 
  const calcExpr = () => {
    const mathExpr = expression.replace("×", "*").replace("÷", "/");
    try {
      if (selectedUser) {
        const newScore = eval(mathExpr).toString();
        liveGame.addPoints(selectedUser, newScore);
        setExpression(newScore);
        updateScoreBoard(selectedUser, parseInt(newScore));
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
    if (game === undefined || game === null) {
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



  
  function updateScoreBoard(pName: string, addScore: number) {
    if (scoreBoard){
      const newScoreBoard = scoreBoard.map((score) => {
        if (score.playerName === pName) {
          score.score += addScore;
        }
        return score;
      });
      setScoreBoard(newScoreBoard);
    }
    
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
      <div className={SpillStyles["header-cards"]}>
        <Card title={gameTitle} />
        <div
          className={`${CardStyles["card"]} 
                            ${ButtonStyles["button--green"]}`}
        >
          <div className={CardStyles["card-header-wrapper"]}>
            <h4
              className={`${CardStyles["card-title"]} ${SpillStyles.timeLabel} `}
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
          {liveGame.scores.map((member, index) => {
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
                  {member.playerName}
                </td>
                <td>{member.points}</td>
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
      <div className={SpillStyles["calculator-container"]}>
        <Input
          placeholder="Legg til poeng..."
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
            onClick={() => setExpression(expression + " + ")}
          >
            +
          </Button>
          <Button
            className={SpillStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " - ")}
          >
            -
          </Button>
          <Button
            className={SpillStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " × ")}
          >
            ×
          </Button>
          <Button
            className={SpillStyles["operator-button"]}
            variant={ButtonVariant.Round}
            color={ButtonColor.Grey}
            onClick={() => setExpression(expression + " ÷ ")}
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

        <Button
          variant={ButtonVariant.Round}
          color={ButtonColor.Green}
          onClick={onSubmit}
        >
          Fullfør spill
        </Button>
        <ActionLog actions={[]} />
      </div>
    </PageWrapper>
  );
};

export default GameScreen;
