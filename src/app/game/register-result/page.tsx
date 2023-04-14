"use client";

import { useState } from "react";
import styles from "src/styles/RegisterResult.module.css";
import PageWrapper from "src/components/PageWrapper";
import { RadioCards } from "src/components/RadioCards";
import TitleWithInfo from "src/components/TitleWithInfo";
import { CheckboxCards } from "src/components/CheckboxCards";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import {
  useAppDispatch,
  useAppSelector,
  useGetGroupsForCurrentUser,
} from "../../../store/hooks";
import { DataStatus } from "../../../store/store.types";
import Spinner from "../../../components/Spinner";
import { RegisterResultData } from "../../../services/game.service";
import { registerResultAction } from "../../../store/game.reducer";
import { useUser } from "../../../services/user.service";
import { useRouter } from "next/navigation";
import { updateGroupMembershipsAction } from "../../../store/groupsInternal.reducer";
import { recalculateMembershipsResults } from "../../../utils/util";

export default function RegisterResultPage() {
  const groupsWithStatus = useGetGroupsForCurrentUser();
  const gameStatus = useAppSelector((state) => state.games);
  const { user } = useUser();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);

  if (
    !groupsWithStatus.data ||
    groupsWithStatus.status === DataStatus.LOADING ||
    gameStatus.create.status === DataStatus.LOADING ||
    (gameStatus.update.status === DataStatus.LOADING &&
      gameStatus.update.dataId === selectedGroup)
  ) {
    return <Spinner />;
  }

  const group = groupsWithStatus.data.find((g) => g.id === selectedGroup);

  const handleSubmit = async () => {
    if (group && user) {
      const gameData: RegisterResultData = {
        groupId: group.id,
        gameTypeId: selectedGame,
        participants,
        winners,
      };

      const recalculatedStats = recalculateMembershipsResults(
        group.members,
        participants,
        winners
      );

      await dispatch(
        registerResultAction({
          userId: user?.uid,
          gameData,
        })
      ).unwrap();

      await dispatch(
        updateGroupMembershipsAction({
          memberships: recalculatedStats,
          groupId: group.id,
        })
      ).unwrap();

      // TODO: Update route when results page is ready
      // router.push("/result?gameId=" + createdGame.id);
      router.push("/group/" + group.id);
    }
  };

  return (
    <PageWrapper title='Nytt resultat' backPath='/game' authenticated={true}>
      <div>
        <h2 className={styles["title-centered"]}>Velg gruppe</h2>
        <div className={styles["groups-container"]}>
          <RadioCards
            items={groupsWithStatus.data.map((group) => ({
              title: group.emoji + " " + group.name,
              key: group.id,
            }))}
            selected={selectedGroup}
            setSelected={setSelectedGroup}
          />
        </div>
      </div>
      {selectedGroup && group && (
        <>
          <TitleWithInfo
            title='Velg spill'
            infoText='Velg typen spill du ønsker å registrere et nytt resultat for.'
          />
          <div className={styles["groups-container"]}>
            {group.gameTypes && group.gameTypes.length > 0 ? (
              <RadioCards
                items={group.gameTypes.map((gameType) => ({
                  title: gameType.emoji + " " + gameType.name,
                  key: gameType.id,
                }))}
                selected={selectedGame}
                setSelected={setSelectedGame}
              />
            ) : (
              <p>Gruppen har ingen spilltyper</p>
            )}
          </div>
        </>
      )}
      {selectedGame && group && group.members && (
        <>
          {" "}
          <h2 className={styles["title-centered"]}>Velg deltagere</h2>
          <div className={styles["groups-container"]}>
            <CheckboxCards
              items={group.members.map((user) => ({
                title: user.username,
                key: user.id,
              }))}
              checked={participants}
              setChecked={setParticipants}
            />
          </div>
        </>
      )}
      {group && participants.length > 0 && (
        <>
          {" "}
          <TitleWithInfo
            title='Hvem vant?'
            infoText='Flere vinnere kan velges. Alle vinnere får resultat uavgjort mens resten får tap'
          />
          <div className={styles["groups-container"]}>
            <CheckboxCards
              items={group?.members
                .filter((member) => participants.includes(member.id))
                .map((user) => ({
                  title: user.username,
                  key: user.id,
                }))}
              checked={winners}
              setChecked={setWinners}
            />
          </div>
        </>
      )}
      {winners.length > 0 && (
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Round}
            color={ButtonColor.Green}
            onClick={handleSubmit}
          >
            Legg til resultat
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}
