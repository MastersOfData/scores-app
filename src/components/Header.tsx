import styles from '../styles/Header.module.css';
import { BackArrowIcon } from 'src/assets/icons/BackArrowIcon';
import  Link from "next/link";

export type HeaderProps = {
    path?: string;
    children: string;
  }

export default function Header({ path, children } : HeaderProps){
  return (
    <div className={styles["header-container"]}>
      <div className={styles["back-button-container"]}>
        <Link href={{pathname: path ?? "/"}}>
          <BackArrowIcon />
        </Link>
      </div>
      <h1>{children}</h1>
    </div>
  );
}