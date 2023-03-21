"use client"

import React from 'react';
import styles from '../styles/Header.module.css';
import { BackArrowIcon } from 'src/assets/icons/BackArrowIcon';
import { useAtom, atom } from "jotai";
import  Link from "next/link";

const headerTitleAtom = atom("")
const headerPathAtom = atom<string | null>("/")

export default function Header() {
  const [ title ] = useAtom(headerTitleAtom)
  const [ path ] = useAtom(headerPathAtom)
  return (
    <div className={styles["header-container"]}>
      {path &&
        <div className={styles["back-button-container"]}>
          <Link href={{pathname: path ?? "/"}}>
            <BackArrowIcon />
          </Link>
        </div>
      }
      <h1>{title}</h1>
    </div>
  );
}

export function useHeader(title: string, path: string | null = null) {
  const [_title, setTitle] = useAtom(headerTitleAtom)
  const [_path, setPath] = useAtom(headerPathAtom)
  setTitle(title)
  setPath(path)
}