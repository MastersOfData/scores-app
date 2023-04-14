"use client";

import { FC, useRef, useState } from "react";
import { RemoveIcon } from "src/assets/icons/RemoveIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
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
  const dispatch = useAppDispatch();
  const { groupId } = params;
  const [username, setUsername] = useState<string>("");
  const groupsWithStatus = useGetGroupsForCurrentUser();

  if (
    groupsWithStatus.status === DataStatus.LOADING ||
    groupsWithStatus.data === undefined
  ) {
    return <Spinner />;
  }
  const group = groupsWithStatus.data?.find((group) => group.id === groupId);

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
              {group?.members.map((member, index) => {
                return (
                  <tr key={member.userId}>
                    <td className={styles["text-align-left"]}>
                      {member.username}
                    </td>
                    <td>
                      <button className={styles["icon-container"]}>
                        <RemoveIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={styles["remove-members-container"]}>
          <TitleWithInfo
            title="Fjernede medlemmer"
            infoText="Medlemmer som vil bli fjernet"
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageGroupPage;
