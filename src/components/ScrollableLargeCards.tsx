import { FC } from "react";
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
          {...item}
          key={item.key}
        />
      ))}
    </div>
  );
};
