"use client"

import { FormEvent, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react"
import styles from "../styles/Input.module.css"

type StandardInputProps = {
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"],
  onInput?: (value: string) => void
}

type CheckBoxInputProps = {
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"],
  onInput?: (checked: boolean) => void
}

type ToggleInputProps = {
  startingState?: boolean,
  onInput?: (value: boolean) => void
}

type TextAreaInputProps = {
  placeholder?: TextareaHTMLAttributes<HTMLTextAreaElement>["placeholder"],
  onInput?: (value: string) => void,
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>["rows"],
}

type InputProps = 
  (StandardInputProps & { type: "text" | "number" | "email" | "password" }) | 
  (CheckBoxInputProps & { type: "checkbox" }) |
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

function handleTextInput(e: FormEvent, onInput?: (value: string) => void) {
  const elem = e.target as HTMLInputElement | HTMLTextAreaElement
  onInput?.(elem.value)
}

function TextAreaInput({ onInput, ...props }: TextAreaInputProps) {
  return (
    <textarea
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function TextInput({ onInput, ...props }: StandardInputProps) {
  return (
    <input
      type="text"
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function NumberInput({ onInput, ...props }: StandardInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]+"
      className={styles["number-input"]}
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function EmailInput({ onInput, ...props }: StandardInputProps) {
  return (
    <input
      type="email"
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function PasswordInput({ onInput, ...props }: StandardInputProps) {
  return (
    <input
      type="password"
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function handleBooleanInput(e: FormEvent, onInput?: (value: boolean) => void) {
  const elem = e.target as HTMLInputElement
  onInput?.(elem.checked)
}

function CheckBoxInput({ onInput, ...props }: CheckBoxInputProps) {
  return (
    <input
      type="checkbox"
      onInput={e => handleBooleanInput(e, onInput)}
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