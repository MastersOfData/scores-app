import React, { FC } from "react";
import { Card, CardItemSmall } from "./Card";
import styles from "../styles/Card.module.css";

interface RadioCardsProps {
  items: CardItemSmall[] | undefined;
  selected: string | undefined;
  setSelected: (x: string) => void;
  fallbackMessage?: string;
}

export const RadioCards: FC<RadioCardsProps> = ({
  items,
  selected,
  setSelected,
  fallbackMessage,
}) => {
  if (!items) return <p>{fallbackMessage}</p>;

  return (
    <div className={styles["center-cards"]}>
      {items.map((item) => (
        <Card
          key={item.key}
          title={item.title}
          selected={selected === item.key}
          onClick={() => setSelected(item.key)}
        />
      ))}
    </div>
  );
};
