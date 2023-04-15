"use client";

import { FC, useEffect, useState } from "react";
import { RemoveIcon } from "src/assets/icons/RemoveIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { CheckboxCards } from "src/components/CheckboxCards";
import Input from "src/components/Input";
import PageWrapper from "src/components/PageWrapper";
import Spinner from "src/components/Spinner";
import TitleWithInfo from "src/components/TitleWithInfo";
import { getUserId } from "src/services/user.service";
import { joinGroupByInvitationCodeAction } from "src/store/groupsInternal.reducer";
import { useAppDispatch, useGetGroupsForCurrentUser } from "src/store/hooks";
import { DataStatus } from "src/store/store.types";
import styles from "src/styles/ManageGroup.module.css";

interface ManagePageProps {
  params: { groupId: string };
}

const ManageGroupPage: FC<ManagePageProps> = ({ params }) => {
  const groupsWithStatus = useGetGroupsForCurrentUser();
  const dispatch = useAppDispatch();
  const { groupId } = params;
  const group = groupsWithStatus.data?.find((group) => group.id === groupId);

  const [username, setUsername] = useState<string>("");
  const [removedMembers, setRemovedMembers] = useState<string[]>([]);
  const [remainingMembers, setRemainingMembers] = useState<string[]>([]);

  useEffect(() => {
    setRemainingMembers(group?.members.map((member) => member.username) ?? []);
  }, [group?.members]);

  if (
    groupsWithStatus.status === DataStatus.LOADING ||
    groupsWithStatus.data === undefined
  ) {
    return <Spinner />;
  }

  const onAdd = async () => {
    if (username && group) {
      const userId = await getUserId(username);
      if (userId) {
        await dispatch(
          joinGroupByInvitationCodeAction({
            invitationCode: group.invitationCode,
            userId: userId,
          })
        ).unwrap();
      }
      console.log("No user with given username");
    }
    setUsername("");
  };

  const onRemove = (username: string) => {
    const newRemoved = removedMembers;
    const newRemaining = remainingMembers.filter(
      (user) => !(user === username)
    );
    newRemoved.push(username);
    setRemovedMembers(newRemoved);
    setRemainingMembers(newRemaining);
  };

  const onConfirm = async () => {
    console.log("Ikke implementert");
  };

  return (
    <PageWrapper
      title={group?.name ?? "Din gruppe"}
      backPath={`/group/${groupId}`}
    >
      <div className={styles.container}>
        <span className={styles.code}>
          {`Kode: ${group?.invitationCode ?? ""}`}
        </span>
        <div className={styles["input-container"]}>
          <Input
            type="text"
            value={username}
            className={styles["text-input"]}
            placeholder="Brukernavn..."
            onInput={setUsername}
          />
          <Button
            variant={ButtonVariant.Medium}
            color={ButtonColor.Pink}
            onClick={onAdd}
          >
            Legg til
          </Button>
        </div>
        {remainingMembers.length > 0 && (
          <div className={styles["members-list-container"]}>
            <TitleWithInfo
              title="Medlemmer"
              infoText="Fjern medlemmer ved å trykke på rødt skilt"
            />
            <table className={styles["leaderboard"]}>
              <thead>
                <tr>
                  <th className={styles["text-align-left"]}>Medlem</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {remainingMembers.map((username, i) => {
                  return (
                    <tr key={i.toString()}>
                      <td className={styles["text-align-left"]}>{username}</td>
                      <td>
                        <div className={styles["button-container"]}>
                          <Button
                            className={styles["button"]}
                            variant={ButtonVariant.Small}
                            onClick={() => onRemove(username)}
                          >
                            <RemoveIcon />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {removedMembers.length > 0 && (
          <>
            <div className={styles["remove-members-container"]}>
              <TitleWithInfo
                title="Fjernede medlemmer"
                infoText="Trykk på medlem for å angre"
              />
              <div className={styles["groups-container"]}>
                <CheckboxCards
                  items={removedMembers.map((username, i) => ({
                    title: username,
                    key: i.toString(),
                  }))}
                  checked={removedMembers}
                  setChecked={setRemovedMembers}
                />
              </div>
            </div>
            <Button
              variant={ButtonVariant.Medium}
              color={ButtonColor.Red}
              className={styles["primary-button"]}
              onClick={() => onConfirm()}
            >
              Fjern
            </Button>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default ManageGroupPage;
