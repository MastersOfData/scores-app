import React, { FC } from "react";
import { Card } from "./Card";
import styles from "../styles/Card.module.css";

interface RadioCardsProps {
  items: string[];
  selected: string | undefined;
  setSelected: (x: string) => void;
}

export const RadioCards: FC<RadioCardsProps> = ({
  items,
  selected,
  setSelected,
}) => {
  return (
    <div className={styles["center-cards"]}>
      {items.map((item) => (
        <Card
          key={item}
          title={item}
          selected={selected === item}
          onClick={() => setSelected(item)}
        />
      ))}
    </div>
  );
};
