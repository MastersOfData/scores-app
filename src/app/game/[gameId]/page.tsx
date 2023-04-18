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



interface GameScreenProps {
    params: { gameId: string };
  }




const GameScreen: FC<GameScreenProps> = ({ params })=> {
    const { gameId } = params;

    //Vet hvilket spill, må hente ut gruppe fra spillet

    const groupsWithStatus = useGetGroupsForCurrentUser();
    const gamesWithStatus = useGetGamesForGroup(groupId);
    const group = groupsWithStatus.data?.find((group) => group.id === groupId);
    

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
              <th>P</th>
              <th className={GroupStyles["wins-col"]}>W</th>
              <th className={GroupStyles["draws-col"]}>D</th>
              <th className={GroupStyles["losses-col"]}>L</th>
              <th>W%</th>
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
                  <td className={GroupStyles["wins-col"]}>{member.wins}</td>
                  <td className={GroupStyles["draws-col"]}>{member.draws}</td>
                  <td className={GroupStyles["losses-col"]}>{member.losses}</td>
                  <td>{member.winRatio.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>



    </PageWrapper>
    )
}

export default GameScreen;