"use client";

import { FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "../styles/Input.module.css";

// Types
type CommonInputProps<T> = {
  className?: string;
  valueRef?: MutableRefObject<T>,
  defaultValue?: T
};

type TextInputProps = CommonInputProps<string> & {
  placeholder?: string;
  onInput?: (value: string) => void;
  maxLength?: number;
  required?: boolean;
};

type NumberInputProps = CommonInputProps<number> & {
  placeholder?: string;
  defaultValue?: number;
  onInput?: (value: number) => void;
};

type CheckBoxInputProps = CommonInputProps<boolean> & {
  onInput?: (checked: boolean) => void;
};

type ToggleInputProps = CommonInputProps<boolean> & {
  initialValue?: boolean;
  onInput?: (value: boolean) => void;
};

type TextAreaInputProps = CommonInputProps<string> & {
  placeholder?: string;
  onInput?: (value: string) => void;
  rows?: number;
};

type InputProps =
  | (TextInputProps & { type: "text" | "email" | "password" })
  | (NumberInputProps & { type: "number" })
  | (CheckBoxInputProps & { type: "checkbox" })
  | (ToggleInputProps & { type: "toggle" })
  | (TextAreaInputProps & { type: "textarea" });

// Input handlers
function handleTextInput(e: FormEvent, onInput?: (value: string) => void, valueRef?: MutableRefObject<string>) {
  const elem = e.target as HTMLInputElement | HTMLTextAreaElement
  const value = elem.value
  onInput?.(value);
  if (valueRef) valueRef.current = value
}

function handleCheckBoxInput(e: FormEvent, onInput?: (value: boolean) => void, valueRef?: MutableRefObject<boolean>) {
  const elem = e.target as HTMLInputElement
  const value = elem.checked
  onInput?.(value)
  if (valueRef) valueRef.current = value
}

// Input components
export default function Input({ type, ...props }: InputProps) {
  if (type === "toggle")
    return <ToggleInput {...(props as ToggleInputProps)} />;
  if (type === "text") return <TextInput {...(props as TextInputProps)} />;
  if (type === "number")
    return <NumberInput {...(props as NumberInputProps)} />;
  if (type === "password")
    return <PasswordInput {...(props as TextInputProps)} />;
  if (type === "checkbox")
    return <CheckBoxInput {...(props as CheckBoxInputProps)} />;
  if (type === "textarea")
    return <TextAreaInput {...(props as TextAreaInputProps)} />;
  return <EmailInput {...(props as TextInputProps)} />;
}

function TextAreaInput({ onInput, valueRef, ...props }: TextAreaInputProps) {
  return <textarea onInput={(e) => handleTextInput(e, onInput, valueRef)} {...props} />;
}

function TextInput({ onInput, valueRef, ...props }: TextInputProps) {
  return (
    <input
      type='text'
      onInput={(e) => handleTextInput(e, onInput, valueRef)}
      {...props}
    />
  );
}

function EmailInput({ onInput, valueRef, ...props }: TextInputProps) {
  return (
    <input
      type='email'
      onInput={(e) => handleTextInput(e, onInput, valueRef)}
      {...props}
    />
  );
}

function PasswordInput({ onInput, valueRef, ...props }: TextInputProps) {
  return (
    <input
      type='password'
      onInput={(e) => handleTextInput(e, onInput, valueRef)}
      {...props}
    />
  );
}

function NumberInput({ onInput, defaultValue, ...props }: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<number>(defaultValue || 0);
  const regexp = /^[0-9]+$/;
  let regexpStr = regexp + "";
  regexpStr = regexpStr.substring(1, regexpStr.length - 1);

  function handleInput() {
    const elem = ref.current!;
    const valStr = elem.value;
    if (!valStr) {
      setValue(0);
      return;
    }

    const val = parseInt(valStr);
    const isValid = !Number.isNaN(val) && regexp.test(valStr);
    if (!isValid) {
      elem.value = value + "";
      return;
    }

    setValue(val);
  }

  useEffect(() => {
    ref.current!.value = value + "";
    onInput?.(value);
  }, [value, onInput]);

  return (
    <input
      type='text'
      inputMode='numeric'
      pattern={regexpStr}
      className={styles["number-input"]}
      onInput={handleInput}
      ref={ref}
      {...props}
    />
  );
}

function CheckBoxInput({ onInput, valueRef, defaultValue, ...props }: CheckBoxInputProps) {
  return (
    <input
      type='checkbox'
      onInput={(e) => handleCheckBoxInput(e, onInput, valueRef)}
      defaultChecked={defaultValue}
      {...props}
    />
  )
}

function ToggleInput({ onInput, initialValue, className, valueRef }: ToggleInputProps) {
  const [yes, setYes] = useState<boolean>(initialValue ?? true);

  function handleToggle(value: boolean) {
    setYes(value);
    onInput?.(value);
    if (valueRef) valueRef.current = value
  }

  return (
    <span className={styles["toggle-input"]}>
      <button
        className={`${styles["toggle-on"]} ${yes ? styles["selected"] : ""}`}
        onClick={() => handleToggle(true)}
      >
        Ja
      </button>
      <button
        className={`${styles["toggle-off"]} ${
          !yes ? styles["selected"] : ""
        } ${className}`}
        onClick={() => handleToggle(false)}
      >
        Nei
      </button>
    </span>
  );
}
