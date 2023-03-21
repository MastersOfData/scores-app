"use client"

import styles from '../styles/Header.module.css';
import { BackArrowIcon } from 'src/assets/icons/BackArrowIcon';
import { useAtom, atom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import  Link from "next/link";

const headerTitleAtom = atom("")
const headerPathAtom = atom("/")
const headerBackButtonAtom = atom(true)

export default function Header() {
  useHydrateAtoms([[headerTitleAtom, ""], [headerPathAtom, ""]])
  const [ title ] = useAtom(headerTitleAtom)
  const [ path ] = useAtom(headerPathAtom)
  const [ backButton ] = useAtom(headerBackButtonAtom)
  return (
    <div className={styles["header-container"]}>
      {backButton &&
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

export function useHeader(title: string, path: string, backButton = true) {
  const [_title, setTitle] = useAtom(headerTitleAtom)
  const [_path, setPath] = useAtom(headerPathAtom)
  const [_backButton, setBackButton] = useAtom(headerBackButtonAtom)
  setTitle(title)
  setPath(path)
  setBackButton(backButton)
}