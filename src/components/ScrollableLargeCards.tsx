import React, { FC } from "react";
import { Card } from "./Card";
import styles from "../styles/Card.module.css";

export interface LargeCard {
  title: string;
  labels: string[];
  emoji?: string;
}

interface ScrollableLargeCardsProps {
  items: LargeCard[];
}

export const ScrollableLargeCards: FC<ScrollableLargeCardsProps> = ({
  items,
}) => {
  return (
    <div className={styles["scrollable-cards"]}>
      {items.map((item) => (
        <Card
          key={item.title}
          title={item.title}
          labels={item.labels}
          emoji={item.emoji}
        />
      ))}
    </div>
  );
};
