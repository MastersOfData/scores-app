import React, { FC } from "react";
import { Card, CardItem } from "./Card";
import styles from "../styles/Card.module.css";

interface ScrollableLargeCardsProps {
  items: CardItem[];
}

export const ScrollableLargeCards: FC<ScrollableLargeCardsProps> = ({
  items,
}) => {
  return (
    <div className={styles["scrollable-cards"]}>
      {items.map((item) => (
        <Card
          key={item.key}
          title={item.title}
          labels={item.labels}
          emoji={item.emoji}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};
