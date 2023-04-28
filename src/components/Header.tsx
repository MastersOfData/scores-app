"use client";

import styles from "../styles/Header.module.css";
import { BackArrowIcon } from "src/assets/icons/BackArrowIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HeaderProps = {
  children: string;
  backPath?: string;
  useHistoryBack?: boolean;
};

export default function Header({
  children,
  backPath,
  useHistoryBack = false,
}: HeaderProps) {
  const router = useRouter();
  return (
    <div className={styles["header-container"]}>
      {backPath && (
        <div className={styles["back-button-wrapper"]}>
          <Link href={{ pathname: backPath }}>
            <BackArrowIcon />
          </Link>
        </div>
      )}
      {!backPath && useHistoryBack && (
        <div className={styles["back-button-wrapper"]}>
          <div onClick={router.back} style={{ cursor: "pointer" }}>
            <BackArrowIcon />
          </div>
        </div>
      )}
      <div className={styles["title-wrapper"]}>
        <h1>{children}</h1>
        {(backPath || useHistoryBack) && (
          <div className={styles["spacing-right"]} />
        )}
      </div>
    </div>
  );
}
