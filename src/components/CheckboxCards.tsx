import React, { FC } from "react";
import { Card } from "./Card";
import styles from "../styles/Card.module.css";

interface CheckboxCardsProps {
  items: string[];
  checked: string[];
  setChecked: (x: string[]) => void;
}

export const CheckboxCards: FC<CheckboxCardsProps> = ({
  items,
  checked,
  setChecked,
}) => {
  return (
    <div className={styles["center-cards"]}>
      {items.map((item) => (
        <Card
          key={item}
          title={item}
          selected={checked.includes(item)}
          onClick={() => {
            if (checked.includes(item)) {
              setChecked(checked.filter((x) => x !== item));
            } else {
              setChecked([...checked, item]);
            }
          }}
        />
      ))}
    </div>
  );
};
