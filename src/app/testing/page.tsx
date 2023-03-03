"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ControllerIcon } from "src/assets/icons/ControllerIcon";
import { GroupIcon } from "src/assets/icons/GroupIcon";
import { PersonIcon } from "src/assets/icons/PersonIcon";
import { Button, ButtonColor, ButtonVariant } from "src/components/Button";
import { InfoContextProvider, InfoBox, InfoButton } from "src/components/Info";
import Input from "src/components/Input";
import { Card } from "../../components/Card";
import { CenteredSmallCards } from "../../components/CenteredSmallCards";
import { CheckboxCards } from "../../components/CheckboxCards";
import { RadioCards } from "../../components/RadioCards";
import { ScrollableLargeCards } from "../../components/ScrollableLargeCards";
import styles from "../../styles/Testing.module.css";

export default function TestingPage() {
  const router = useRouter();

  // State for card demos
  const users = ["xXbirgerXx", "mr_bean", "lars", "randi", "user1", "user2"];
  const [checked, setChecked] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <main className={styles.container}>
      <div>
        <h1>h1</h1>
        <h2>h2</h2>
        <h3>h3</h3>
        <h4>h4</h4>
        <h5>h5</h5>
        <h6>h6</h6>
      </div>

      <div>
        <strong>Strong text</strong>
        <p>Primary text</p>
        <p className={styles.secondary}>Secondary text</p>
      </div>

      <Button variant={ButtonVariant.Action}>
        <ControllerIcon />
      </Button>
      <Button variant={ButtonVariant.Action} color={ButtonColor.Red}>
        <GroupIcon />
      </Button>
      <Button variant={ButtonVariant.Action} color={ButtonColor.Pink}>
        <PersonIcon />
      </Button>
      <Button variant={ButtonVariant.Small}>Liten knapp</Button>
      <Button variant={ButtonVariant.Medium}>Medium knapp</Button>
      <Button
        variant={ButtonVariant.Round}
        color={ButtonColor.Pink}
        onClick={() => router.push("/")}
      >
        Rund knapp
      </Button>

      <div className={styles.column}>
        <Input type='text' placeholder='Text Input' onInput={console.log} />
        <Input type='email' placeholder='Email Input' onInput={console.log} />
        <Input
          type='password'
          placeholder='Password Input'
          onInput={console.log}
        />
        <Input
          type='number'
          placeholder='Number Input'
          defaultValue={5}
          onInput={console.log}
        />
        <Input
          type='textarea'
          rows={6}
          placeholder='TextArea Input'
          onInput={console.log}
        />
        <Input type='checkbox' onInput={console.log} />
        <Input type='toggle' onInput={console.log} />
        <div>
          <InfoContextProvider>
            <InfoButton />
            <InfoBox>Informasjonstekst</InfoBox>
          </InfoContextProvider>
        </div>
      </div>

      <h2>Cards</h2>

      <p>Small card</p>
      <Card title={"Small card"} emoji='🎲' />
      <p>Large card / card with labels</p>
      <Card
        title={"Large card"}
        emoji='🎾'
        labels={["Info label", "More info"]}
      />

      <p>Centered small cards [CenteredSmallCards]</p>
      <CenteredSmallCards items={users} />

      <p>Scrollable large cards [ScrollableLargeCards]</p>
      <ScrollableLargeCards
        items={[
          {
            title: "Bingo-gjengen",
            labels: ["Noe relevant info", "Annen info"],
            emoji: "🎰",
          },
          {
            title: "Bingo-gjengen",
            labels: ["Noe relevant info", "Annen info"],
            emoji: "🎰",
          },
          {
            title: "Bingo",
            labels: ["Noe relevant info", "Annen info"],
            emoji: "🎰",
          },
          {
            title: "Bingo-gjengen",
            labels: ["Noe relevant info", "Annen info"],
            emoji: "🎰",
          },
          {
            title: "Bingo-gjengen",
            labels: ["Noe relevant info", "Annen info"],
            emoji: "🎰",
          },
        ]}
      />

      <p>Card checkboxes [CheckboxCards]</p>
      <CheckboxCards items={users} checked={checked} setChecked={setChecked} />

      <p>Card radios [RadioCards]</p>
      <RadioCards items={users} selected={selected} setSelected={setSelected} />
    </main>
  );
}
