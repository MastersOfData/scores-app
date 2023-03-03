import React, { FC } from "react";
import styles from "../styles/Card.module.css";

enum CardSize {
  Small = "card-sm",
  Large = "card-lg",
}

interface CardProps {
  title: string;
  selected?: boolean;
  onClick?: () => void;
  labels?: string[];
  emoji?: string;
}

export const Card: FC<CardProps> = ({
  title,
  selected,
  onClick,
  labels,
  emoji,
}) => {
  const size = labels ? CardSize.Large : CardSize.Small;

  return (
    <div
      className={`${styles["card"]} ${styles[size]} ${
        selected ? styles["card-selected"] : ""
      } ${onClick ? styles["card-clickable"] : ""}
      `}
      onClick={onClick}
    >
      <div className={styles["card-header-wrapper"]}>
        {emoji && (
          <div className={styles["card-emoji"]}>{emoji.substring(0, 2)}</div>
        )}
        <h4 className={styles["card-title"]}>{title}</h4>
      </div>

      {labels && (
        <div className={styles["card-labels-wrapper"]}>
          {labels.map((label) => (
            <div key={label} className={styles["card-label"]}>
              <span className={styles["card-label-text"]}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
