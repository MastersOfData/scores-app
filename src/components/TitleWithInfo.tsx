import styles from "src/styles/TitleWithInfo.module.css";
import { InfoBox, InfoButton, InfoContextProvider } from "./Info";

export type TitleWithInfoProps = {
  title: string;
  infoText: string;
};

export default function TitleWithInfo({ title, infoText }: TitleWithInfoProps) {
  return (
    <InfoContextProvider>
      <div className={styles["text-container"]}>
        <h2 className={styles["title-centered"]}>
          {title}
          <InfoButton />
        </h2>
      </div>
      <div className={styles["infobox-container"]}>
        <InfoBox>{infoText}</InfoBox>
      </div>
    </InfoContextProvider>
  );
}
