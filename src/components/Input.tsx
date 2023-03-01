import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react"
import styles from "../styles/Input.module.css"

type StandardInputProps = {
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"],
  onInput?: InputHTMLAttributes<HTMLInputElement>["onInput"]
}

type ToggleInputProps = {
  startingState?: boolean,
  onInput?: (value: boolean) => void
}

type TextAreaInputProps = {
  placeholder?: TextareaHTMLAttributes<HTMLTextAreaElement>["placeholder"],
  onInput?: TextareaHTMLAttributes<HTMLTextAreaElement>["onInput"],
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>["rows"],
}

type InputProps = 
  (StandardInputProps & { type: "text" | "number" | "email" | "password" | "checkbox" }) | 
  (ToggleInputProps & { type: "toggle" }) |
  (TextAreaInputProps & { type: "textarea" })

export default function Input(props: InputProps) {
  if (props.type === "toggle")   return <ToggleInput   {...props} />
  if (props.type === "text")     return <TextInput     {...props} />
  if (props.type === "number")   return <NumberInput   {...props} />
  if (props.type === "password") return <PasswordInput {...props} />
  if (props.type === "checkbox") return <CheckBoxInput {...props} />
  if (props.type === "textarea") return <TextAreaInput {...props} />
  return <EmailInput {...props} />
}

function TextAreaInput(props: TextAreaInputProps) {
  return (
    <textarea
      {...props}
    />
  )
}

function TextInput(props: StandardInputProps) {
  return (
    <input
      type="text"
      {...props}
    />
  )
}

function NumberInput(props: StandardInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]+"
      className={styles["number-input"]}
      {...props}
    />
  )
}

function EmailInput(props: StandardInputProps) {
  return (
    <input
      type="email"
      {...props}
    />
  )
}

function PasswordInput(props: StandardInputProps) {
  return (
    <input
      type="password"
      {...props}
    />
  )
}

function CheckBoxInput(props: StandardInputProps) {
  return (
    <input
      type="checkbox"
      {...props}
    />
  )
}

function ToggleInput({ onInput, startingState }: ToggleInputProps) {
  const [yes, setYes] = useState<boolean>(startingState ?? true)

  function handleToggle(value: boolean) {
    setYes(value)
    if (onInput) onInput(value)
  }

  return (
    <span className={styles["binary-choice-input"]}>
      <button 
        className={`${styles["binary-choice-left"]} ${yes ? styles["selected"] : ""}`} 
        onClick={() => handleToggle(true)}
      >
        Ja
      </button>
      <button 
        className={`${styles["binary-choice-right"]} ${!yes ? styles["selected"] : ""}`} 
        onClick={() => handleToggle(false)}
      >
        Nei
      </button>
    </span>
  )
}