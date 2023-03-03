import styles from "src/styles/Emoji.module.css"

export default function Emoji({ children }: { children: JSX.Element | string }) {
  return <span className={styles.emoji}>{typeof children === "string" ? children.substring(0, 2) : children}</span>
}