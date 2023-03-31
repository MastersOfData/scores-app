import { FC } from "react";
import { Card, CardItemSmall } from "./Card";
import styles from "../styles/Card.module.css";

interface CenteredSmallCardsProps {
  items: CardItemSmall[];
}

export const CenteredSmallCards: FC<CenteredSmallCardsProps> = ({ items }) => {
  return (
    <div className={styles["center-cards"]}>
      {items.map((item) => (
        <Card key={item.key} title={item.title} />
      ))}
    </div>
  );
};
