"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import styles from "../styles/Input.module.css"

// Types
type TextInputProps = {
  placeholder?: string,
  onInput?: (value: string) => void
}

type NumberInputProps = {
  placeholder?: string,
  defaultValue?: number,
  onInput?: (value: number) => void
}

type CheckBoxInputProps = {
  placeholder?: string,
  onInput?: (checked: boolean) => void
}

type ToggleInputProps = {
  startingState?: boolean,
  onInput?: (value: boolean) => void
}

type TextAreaInputProps = {
  placeholder?: string,
  onInput?: (value: string) => void,
  rows?: number,
}

type InputProps = 
  (TextInputProps & { type: "text" | "email" | "password" }) | 
  (NumberInputProps & { type: "number" }) |
  (CheckBoxInputProps & { type: "checkbox" }) |
  (ToggleInputProps & { type: "toggle" }) |
  (TextAreaInputProps & { type: "textarea" })

// Input handlers
function handleTextInput(e: FormEvent, onInput?: (value: string) => void) {
  const elem = e.target as HTMLInputElement | HTMLTextAreaElement
  onInput?.(elem.value)
}

function handleCheckBoxInput(e: FormEvent, onInput?: (value: boolean) => void) {
  const elem = e.target as HTMLInputElement
  onInput?.(elem.checked)
}

// Input components
export default function Input(props: InputProps) {
  if (props.type === "toggle")   return <ToggleInput   {...props} />
  if (props.type === "text")     return <TextInput     {...props} />
  if (props.type === "number")   return <NumberInput   {...props} />
  if (props.type === "password") return <PasswordInput {...props} />
  if (props.type === "checkbox") return <CheckBoxInput {...props} />
  if (props.type === "textarea") return <TextAreaInput {...props} />
  return <EmailInput {...props} />
}

function TextAreaInput({ onInput, ...props }: TextAreaInputProps) {
  return (
    <textarea
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function TextInput({ onInput, ...props }: TextInputProps) {
  return (
    <input
      type="text"
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function EmailInput({ onInput, ...props }: TextInputProps) {
  return (
    <input
      type="email"
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function PasswordInput({ onInput, ...props }: TextInputProps) {
  return (
    <input
      type="password"
      onInput={e => handleTextInput(e, onInput)}
      {...props}
    />
  )
}

function NumberInput({ onInput, defaultValue, ...props }: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<number>(defaultValue || 0)

  function handleInput() {
    const elem = ref.current!
    const valStr = elem.value
    if (!valStr) {
      setValue(0)
      return
    }

    const val = parseInt(valStr)
    const isValid = !Number.isNaN(val)
    if (!isValid) {
      elem.value = value + ""
      return
    }

    setValue(val)
  }

  useEffect(() => {
    ref.current!.value = value + ""
    onInput?.(value)
  }, [value])

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]+"
      className={styles["number-input"]}
      onInput={handleInput}
      ref={ref}
      {...props}
    />
  )
}

function CheckBoxInput({ onInput, ...props }: CheckBoxInputProps) {
  return (
    <input
      type="checkbox"
      onInput={e => handleCheckBoxInput(e, onInput)}
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