import React, { FC } from "react";
import styles from "../styles/Card.module.css";

export enum CardSize {
  Small = "card-sm",
  Large = "card-lg",
}

export enum CardType {
  Radio,
  Checkbox,
  Info,
}

export enum CardColor {}

interface CardProps {
  size: CardSize;
  type: CardType;
  title: string;
  labels?: string[];
  emoji?: string;
}

export const Card: FC<CardProps> = ({ size, type, title, labels, emoji }) => {
  const a = 1;

  return (
    <div className={styles["card"]}>
      <div className={styles["card-header-wrapper"]}>
        <div className={styles["card-emoji"]}>{emoji}</div>
        <h4 className={styles["card-title"]}>{title}</h4>
      </div>
      <div className={styles["labels"]}>
        {labels &&
          labels.map((label) => (
            <div key={label} className={styles["label"]}>
              {label}
            </div>
          ))}
      </div>
    </div>
  );
};
