"use client";

import { FC, useState } from "react";
import { Card } from "src/components/Card";
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "src/components/PageWrapper";
import CardStyles from "src/styles/Card.module.css";
import ButtonStyles from "src/styles/Button.module.css";
<<<<<<< HEAD
import SpillStyles from "src/styles/Spill.module.css"
import { useGetGroupsForCurrentUser, useUserHasAccessToGame, useGetLiveGame } from "src/store/hooks";
import GroupStyles from "src/styles/Group.module.css";
=======
import SpillStyles from "src/styles/Spill.module.css";
>>>>>>> main
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
import { useUser, getUserId } from "src/services/user.service";
import { useGetGameById } from "src/store/hooks";

import Input from "src/components/Input";
<<<<<<< HEAD
import { DataStatus } from "../../../store/store.types";
import Spinner from "../../../components/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { GameActionType } from "src/types/types";

=======
import { getUserId } from "src/services/user.service";
import { DataStatus } from "../../../store/store.types";
import Spinner from "../../../components/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { ActionLog } from "src/components/ActionLog";
>>>>>>> main

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

<<<<<<< HEAD

interface ScoreBoardProps {
  playerId: string;
  playerName: string;
  score: string;
}

const GameScreen: FC<GameScreenProps> = ({ params })=> {
    const router = useRouter();
    const { gameId } = params;
    const access = useUserHasAccessToGame(gameId)

    const gamesWithStatus = useGetGameById(gameId);
    const game = gamesWithStatus.data;

    const userContext = useUser();
    const user = userContext.userData;
    
    const groupsWithStatus = useGetGroupsForCurrentUser();

    const liveGame = useGetLiveGame(gameId)


    //Hooks
    const [selectedUser, setSelectedUser] = useState<string | undefined>("");
    const [isGroupGame, setIsGroupGame] = useState(true);
    const [expression, setExpression] = useState<string>("");
    const [currentUserPoints, setCurrentUserPoints] = useState<string>("");
    const [scoreBoard, setScoreBoard] = useState<ScoreBoardProps[]>([]);

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

    if (!access.hasAccess){
      return <p>{access.noAccessReason}</p>
    }
    //Kan en se denne siden uten å logge inn?
    if (user === null){
      return <div />
    }
    //NOT DONE
    if (game === undefined){
      return <div />
    }
    
    
    

    const userArr = [user];
    
    const group = groupsWithStatus.data?.find((group) => group.id === game.groupId);

    const calcExpr = () => {
      const mathExpr = expression.replace("×", "*").replace("÷", "/")
      try{
        if (selectedUser){
          const newScore = eval(mathExpr).toString();
          liveGame.addPoints(selectedUser, newScore)
          setExpression(newScore);
        }
        else{
          alert("User has not been defined!")
        }
        
      }
      catch (err) {
        console.log(err)
        alert("Not a valid expression!")
      }
    }

    async function setUserPoints(username : string): Promise<void> {
      console.log("SetUserPoints")
      if (game === undefined) {
        return 
      }
      //Get score from user and setExpression(score)

      setSelectedUser(username);
      
      const userId = await getUserId(username);
      if (userId === undefined){
        return
      }

      for (const score of game.players) {
        if (score.playerId === userId) {
          setExpression(score.toString())
          break;
        }
      }
    }

    const gamePlayerList = game.players

    if (!group) {
        return (
          <PageWrapper title="" backPath="/" authenticated>
            <div className="center-items">
              <p>Gruppen finnes ikke! 🚨</p>
            </div>
          </PageWrapper>
        );
=======
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
>>>>>>> main
      }
    } catch (err) {
      console.log(err);
      alert("Not a valid expression!");
    }
  };

<<<<<<< HEAD
    function updatePlayerScore(pName: string, addScore: number): void {
      const newPlayers = scoreBoard.map((player) => {
        if (player.playerName === pName) {
          return { playerId: player.playerId,
                   playerName: player.playerName,
                  score: player.score +  addScore};
        }
        else{
          return player;
        }
      });
      setScoreBoard(newPlayers);
    }
    
    async function updateScoreBoard() {
      const newScoreBoard = liveGame.localGameLog.map(log => {
        if (log.actionType === GameActionType.ADD_POINTS)
      })
      setScoreBoard(newScoreBoard);
    }

=======
  async function setUserPoints(username: string): Promise<void> {
    console.log("SetUserPoints");
    if (game === undefined) {
      return;
    }
    //Get score from user and setExpression(score)
>>>>>>> main

    setSelectedUser(username);

    const userId = await getUserId(username);
    if (userId === undefined) {
      return;
    }

<<<<<<< HEAD
return (
    <PageWrapper title='Spill' backPath='/' authenticated={true}>
        <div className={SpillStyles["header-cards"]}>
            <Card title = {gameTitle} />
            <div className={`${CardStyles["card"]} 
                            ${ButtonStyles["button--green"]}`}>
                <div className={CardStyles["card-header-wrapper"]}>
                    <h4 className={`${CardStyles["card-title"]} ${SpillStyles.timeLabel} `}>{time}</h4>
                </div>
            </div>
=======
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
>>>>>>> main
        </div>
      </PageWrapper>
    );
  }

  const gameEmoji = "😂";
  const gameTitle = gameEmoji + "Tennis";
  const time = "13:37";
  const groupMember = ["Tore", "Tang"];

<<<<<<< HEAD
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
                  <td>{member}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className={RegResultStyles["title-centered"]}>Oppdater poeng</h2>
        {isGroupGame ? (<div>
=======
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
>>>>>>> main
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
<<<<<<< HEAD
        </div>) : (<RadioCards
              items={userArr.map((user, i) => ({
                title: user.toString(),
                key: user.toString(),
              }))}
              selected={selectedUser}
              setSelected={setSelectedUser}
            />)}
        <div className={SpillStyles["calculator-container"]}>
          <Input 
              placeholder="Legg til poeng..."
              type = {"text"}
              value = {expression}
              className = {SpillStyles["text-input"]}
              onInput = {setExpression} />

          <div className={SpillStyles["math-buttonsContainer"]}>
              <Button 
                className={SpillStyles["operator-button"]}
                variant = {ButtonVariant.Round}
                color = {ButtonColor.Grey}
                onClick = {() => setExpression(expression + " + ")} 
              > 
                +
              </Button>
              <Button 
                className={SpillStyles["operator-button"]}
                variant = {ButtonVariant.Round}
                color = {ButtonColor.Grey}
                onClick = {() => setExpression(expression + " - ")} 
              > 
                -
              </Button>
              <Button 
                className={SpillStyles["operator-button"]}
                variant = {ButtonVariant.Round}
                color = {ButtonColor.Grey}
                onClick = {() => setExpression(expression + " × ")} 
              > 
                ×
              </Button>
              <Button 
                className={SpillStyles["operator-button"]}
                variant = {ButtonVariant.Round}
                color = {ButtonColor.Grey}
                onClick = {() => setExpression(expression + " ÷ ")} 
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
=======
>>>>>>> main
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
