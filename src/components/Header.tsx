"use client"

import styles from '../styles/Header.module.css';
import { BackArrowIcon } from 'src/assets/icons/BackArrowIcon';
import Link from "next/link";

type HeaderProps = {
  children: string,
  backPath?: string
}

export default function Header({ children, backPath }: HeaderProps) {
  return (
    <div className={styles["header-container"]}>
      {backPath &&
        <div className={styles["back-button-container"]}>
          <Link href={{pathname: backPath}}>
            <BackArrowIcon />
          </Link>
        </div>
      }
      <h1>{children}</h1>
    </div>
  );
}