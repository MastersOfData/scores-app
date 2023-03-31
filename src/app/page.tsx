"use client";

import styles from "../styles/Home.module.css";
import { ControllerIcon } from "src/assets/icons/ControllerIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { PersonIcon } from "src/assets/icons/PersonIcon";
import { GroupIcon } from "src/assets/icons/GroupIcon";
import Input from "src/components/Input";
import { ScrollableLargeCards } from "src/components/ScrollableLargeCards";
import { CardItem } from "src/components/Card";
import { mapGroupsToCardItems } from "src/utils/util";
import PageWrapper from "src/components/PageWrapper";
import { useGetGroupsForCurrentUser } from "../store/hooks";
import { DataStatus } from "../store/store.types";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../fire-base/auth";
import Spinner from "../components/Spinner";

export default function Home() {
  const groupsWithStatus = useGetGroupsForCurrentUser();
  const router = useRouter();

  const user = getCurrentUser();

  if (
    !groupsWithStatus.data ||
    groupsWithStatus.status === DataStatus.LOADING
  ) {
    return <Spinner />;
  }

  const cardItemsGroups: CardItem[] = mapGroupsToCardItems(
    groupsWithStatus.data ?? [],
    true,
    router
  );

  return (
    <PageWrapper title='Velkommen!' authenticated={true}>
      <div className={styles["buttons-container"]}>
        <div className={styles["button-container"]}>
          <Button variant={ButtonVariant.Action} withLink href={"/profile"}>
            <PersonIcon />
          </Button>
          <p className={styles.label}>{"Profil"}</p>
        </div>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Orange}
            withLink
            href='/play'
          >
            <ControllerIcon />
          </Button>
          <p className={styles.label}>Nytt spill</p>
        </div>
        <div className={styles["button-container"]}>
          <Button
            variant={ButtonVariant.Action}
            color={ButtonColor.Pink}
            withLink
            href='/create-group'
          >
            <GroupIcon />
          </Button>
          <p className={styles.label}>Ny gruppe</p>
        </div>
      </div>
      <h2 className={styles["title-centered"]}>Bli med i en gruppe</h2>
      <div className={styles["group-input-container"]}>
        <Input
          type='text'
          className={styles["text-input"]}
          placeholder='Invitasjons-kode...'
        />
        <Button variant={ButtonVariant.Medium} color={ButtonColor.Red}>
          Bli med
        </Button>
      </div>
      <h2 className={styles.title}>Dine grupper</h2>
      {user ? (
        <div className={styles["cards-container"]}>
          <ScrollableLargeCards items={cardItemsGroups} />
        </div>
      ) : (
        <p>Logg inn for å se dine grupper</p>
      )}
    </PageWrapper>
  );
}
