import { FC } from "react";
import styles from "../styles/Group.module.css";

export enum MedalType {
  GOLD = "gold-medal",
  SILVER = "silver-medal",
  BRONZE = "bronze-medal",
}

interface MedalProps {
  type: MedalType;
}

const Medal: FC<MedalProps> = ({ type }) => (
  <div className={`${styles["medal"]} ${styles[type]}`} />
);

export default Medal;
