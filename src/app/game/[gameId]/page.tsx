"use client";

import { FC, useState } from "react";
import { Card } from "src/components/Card"
import { Button, ButtonVariant, ButtonColor } from "src/components/Button";
import PageWrapper from "src/components/PageWrapper"
import CardStyles from "src/styles/Card.module.css";
import ButtonStyles from "src/styles/Button.module.css";
import SpillStyles from "src/styles/Spill.module.css"
import {
    useGetGamesForGroup,
    useGetGroupsForCurrentUser,
  } from "src/store/hooks";
import GroupStyles from "src/styles/Group.module.css";
import {
    calculateGroupLeaderboard,
    mapGamesToCardItems,
    mapGameTypesToCardItems,
  } from "src/utils/util";
import Medal, { MedalType } from "src/components/Medal";
import { CheckboxCards } from "src/components/CheckboxCards";
import RegResultStyles from "src/styles/RegisterResult.module.css";
import { useUser } from "src/services/user.service";
import { CardItemSmall } from "src/components/Card";


import Input from "src/components/Input";

interface GameScreenProps {
    params: { gameId: string };
  }




const GameScreen: FC<GameScreenProps> = ({ params })=> {
    const { gameId } = params;

    const user = useUser();
    const userArr = [user]

    //Vet hvilket spill, må hente ut gruppe fra spillet

    const groupsWithStatus = useGetGroupsForCurrentUser();
    const gamesWithStatus = useGetGamesForGroup(groupId);
    const group = groupsWithStatus.data?.find((group) => group.id === groupId);

    //Hooks
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isGroupGame, setIsGroupGame] = useState(true);
    const [expression, setExpression] = useState<string>("");
    

    const calcExpr = () => {
      const mathExpr = expression.replace("x", "*")
      setExpression(eval(mathExpr).toString())
    }

    function addOperator(operator : string): void {
      setExpression(expression + operator)
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


    const gameEmoji = "😂"
    const gameTitle = gameEmoji + "Tennis"
    const time = "13:37"
    const groupMember = ["Tore", "Tang"]

    const leaderboardStats = calculateGroupLeaderboard(group.members);

   
return (
    <PageWrapper title='Spill' backPath='/' authenticated={true}>
        <div className={CardStyles["center-cards"]}>
            <Card title = {gameTitle} />
            <div className={`${CardStyles["card"]} 
                            ${ButtonStyles["button--green"]}`}>
                <div className={CardStyles["card-header-wrapper"]}>
                    <h4 className={`${CardStyles["card-title"]} ${SpillStyles.timeLabel} `}>{time}</h4>
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
                  <td>{member.gamesPlayed}</td>
                  <td>{member.wins}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className={RegResultStyles["title-centered"]}>Oppdater poeng</h2>
        {isGroupGame ? (<div>
          <h2 className={RegResultStyles["title-centered"]}>Velg deltagere</h2>
          <div className={RegResultStyles["groups-container"]}>
            <CheckboxCards
              items={group.members.map((user, i) => ({
                title: user.username,
                key: i.toString(),
              }))}
              checked={selectedUsers}
              setChecked={setSelectedUsers}
            />
          </div>
        </div>) : (<CheckboxCards
              items={userArr.map((user, i) => ({
                title: user.toString(),
                key: i.toString(),
              }))}
              checked={selectedUsers}
              setChecked={setSelectedUsers}
            />)}
        
        <Input 
            type = {"text"}
            value = {expression}
            className = {SpillStyles["text-input"]}
            onInput = {setExpression} />

        <div className={SpillStyles["math-buttons"]}>
            <Button 
              variant = {ButtonVariant.Round}
              onClick = {() => setExpression(expression + " + ")} 
            > 
              +
            </Button>
            <Button 
              variant = {ButtonVariant.Round}
              onClick = {() => setExpression(expression + " - ")} 
            > 
              -
            </Button>
            <Button 
              variant = {ButtonVariant.Round}
              onClick = {() => setExpression(expression + " x ")} 
            > 
              x
            </Button>
            <Button 
              variant = {ButtonVariant.Round}
              onClick = {() => setExpression(expression + " / ")} 
            > 
              /
            </Button>
        </div>

        <Button
          variant={ButtonVariant.Medium}
          color={ButtonColor.Red}
          onClick={calcExpr}
        >
          Regn ut
        </Button>



    </PageWrapper>
    )
}

export default GameScreen;