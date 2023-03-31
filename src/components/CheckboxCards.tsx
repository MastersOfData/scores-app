import { FC } from "react";
import { Card, CardItemSmall } from "./Card";
import styles from "../styles/Card.module.css";

interface CheckboxCardsProps {
  items: CardItemSmall[];
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
          key={item.key}
          title={item.title}
          selected={checked.includes(item.key)}
          onClick={() => {
            if (checked.includes(item.key)) {
              setChecked(checked.filter((x) => x !== item.key));
            } else {
              setChecked([...checked, item.key]);
            }
          }}
        />
      ))}
    </div>
  );
};
