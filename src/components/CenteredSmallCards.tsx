import React, { FC } from "react";
import { Card } from "./Card";
import styles from "../styles/Card.module.css";

interface CenteredSmallCardsProps {
  items: string[];
}

export const CenteredSmallCards: FC<CenteredSmallCardsProps> = ({ items }) => {
  return (
    <div className={styles["center-cards"]}>
      {items.map((item) => (
        <Card key={item} title={item} />
      ))}
    </div>
  );
};
