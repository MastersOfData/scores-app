"use client";

import { useState } from "react";
import styles from "src/styles/RegisterResult.module.css";
import PageWrapper from "src/components/PageWrapper";
import { Group } from "src/fire-base/models";
import { Card } from "src/components/Card";
import { mapGroupsToCardItems } from "src/utils/util";
import { RadioCards } from "src/components/RadioCards";
import { InfoBox, InfoButton, InfoContextProvider } from "src/components/Info";
import TitleWithInfo from "src/components/TitleWithInfo";

export default function RegisterResultPage() {
  //Mock groups
  const groups: Group[] = [
    { name: "Bingo-gjengen", emoji: "🎰", games: [], invitationCode: "5673" },
    { name: "Tennis-gutta", emoji: "🎾", games: [], invitationCode: "4822" },
    { name: "Yatzy for life", emoji: "🎲", games: [], invitationCode: "5721" },
  ];

  const [selectedGroup, setSelectedGroup] = useState<string>("");

  return (
    <PageWrapper title="Registrer resultat" backPath="/play">
      <div>
        <h2 className={styles["title-centered"]}>Velg gruppe</h2>
        <div className={styles["groups-container"]}>
          <RadioCards
            items={groups.map((group, i) => ({
              title: group.emoji + " " + group.name,
              key: i.toString(),
            }))}
            selected={selectedGroup}
            setSelected={setSelectedGroup}
          />
        </div>
      </div>
      <TitleWithInfo
        title="Velg spill"
        infoText="Velg typen spill du ønsker å registrere et nytt resultat for."
      />
      <div className={styles["groups-container"]}>
        <RadioCards
          items={groups.map((group, i) => ({
            title: group.emoji + " " + group.name,
            key: i.toString(),
          }))}
          selected={selectedGroup}
          setSelected={setSelectedGroup}
        />
      </div>
      <h2 className={styles["title-centered"]}>Velg deltagere</h2>
      <TitleWithInfo
        title="Ønsker du lag?"
        infoText="Ønsker du at deltagerne skal deles inn i lag?"
      />
      <TitleWithInfo
        title="Hvem vant?"
        infoText="Flere vinnere kan velges. Alle vinnere får resultat uavgjort mens resten får tap"
      />
    </PageWrapper>
  );
}
