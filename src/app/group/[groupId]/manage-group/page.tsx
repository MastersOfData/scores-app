"use client";

import { FC, useState } from "react";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import Input from "src/components/Input";
import PageWrapper from "src/components/PageWrapper";
import Spinner from "src/components/Spinner";
import { useGetGroupsForCurrentUser } from "src/store/hooks";
import { DataStatus } from "src/store/store.types";
import styles from "src/styles/ManageGroup.module.css";

interface ManagePageProps {
  params: { groupId: string };
}

const ManageGroupPage: FC<ManagePageProps> = ({ params }) => {
  const { groupId } = params;
  const [username, setUsername] = useState<string | undefined>();
  const groupsWithStatus = useGetGroupsForCurrentUser();

  if (
    groupsWithStatus.status === DataStatus.LOADING ||
    groupsWithStatus.data === undefined
  ) {
    return <Spinner />;
  }
  const group = groupsWithStatus.data?.find((group) => group.id === groupId);

  const onAdd = async () => {};
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
      </div>
    </PageWrapper>
  );
};

export default ManageGroupPage;
