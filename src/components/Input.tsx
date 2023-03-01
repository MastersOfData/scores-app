import { InputHTMLAttributes, useState } from "react"
import styles from "../styles/Input.module.css"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function TextInput(props: InputProps) {
  return (
    <input
      type="text"
      {...props}
    />
  )
}

export function NumberInput(props: InputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]+"
      {...props}
    />
  )
}

export function EmailInput(props: InputProps) {
  return (
    <input
      type="email"
      {...props}
    />
  )
}

export function PasswordInput(props: InputProps) {
  return (
    <input
      type="password"
      {...props}
    />
  )
}

type BinaryChoice = "left" | "right"

type BinaryChoiceInputProps = {
  leftText: string,
  rightText: string,
  startingState: BinaryChoice,
  onChoice?: (choice: BinaryChoice) => void
}

export function BinaryChoiceInput({ leftText, rightText, startingState, onChoice }: BinaryChoiceInputProps) {
  const [selected, setSelected] = useState<BinaryChoice>(startingState)

  function handleChoice(choice: BinaryChoice) {
    setSelected(choice)
    if (onChoice) onChoice(choice)
  }

  return (
    <span className={styles["binary-choice-input"]}>
      <button 
        className={`${styles["binary-choice-left"]} ${selected === "left" ? styles["selected"] : ""}`} 
        onClick={() => handleChoice("left")}
      >
        {leftText}
      </button>
      <button 
        className={`${styles["binary-choice-right"]} ${selected === "right" ? styles["selected"] : ""}`} 
        onClick={() => handleChoice("right")}
      >
        {rightText}
      </button>
    </span>
  )
}