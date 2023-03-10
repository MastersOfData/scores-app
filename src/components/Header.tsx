import React, { FC } from 'react';
import styles from '../styles/Header.module.css';
import { BackArrowIcon } from 'src/assets/icons/BackArrowIcon';
import  Link from "next/link";

export type HeaderProps = (
  {
    path?: string;
    children: string;
  }
)

export function Header({ path, children } : HeaderProps){

  return (
        <div  className = {styles["header-container"]}>
          <Link href={{pathname: path ?? "/"}}>
            <BackArrowIcon />
          </Link>
          <h1>{children}</h1>
        </div>
  );
}

export default Header;