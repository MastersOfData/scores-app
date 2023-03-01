import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "../styles/Button.module.css";

export enum ButtonColor {
  Green = "button--green",
  Red = "button--red",
  Yellow = "button--yellow",
  Pink = "button--pink",
  Orange = "button--orange",
}

export enum ButtonVariant {
  Small = "button-sm",
  Medium = "button-md",
  Round = "button-round",
  Action = "button-action",
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: ButtonColor;
  variant: ButtonVariant;
  onClick?: () => void;
  children?: ReactNode;
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant,
    color = ButtonColor.Green,
    className = "",
    onClick,
    children,
  } = props;

  return (
    <button
      className={`${styles[variant]} ${styles[color]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
