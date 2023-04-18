import Link from "next/link";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "../styles/Button.module.css";

export enum ButtonColor {
  Green = "button--green",
  Red = "button--red",
  Yellow = "button--yellow",
  Pink = "button--pink",
  Orange = "button--orange",
  Grey = "button-grey"

}

export enum ButtonVariant {
  Small = "button-sm",
  Medium = "button-md",
  Round = "button-round",
  Action = "button-action",
}

type RouteProps =
  | {
      withLink?: false;
      href?: undefined;
    }
  | {
      withLink: true;
      href: string;
    };

export type ButtonProps = (ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  color?: ButtonColor;
  variant: ButtonVariant;
  onClick?: () => void;
  children?: ReactNode;
}) &
  RouteProps;

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant,
    color = ButtonColor.Green,
    className = "",
    onClick,
    children,
    withLink,
    href,
    ...rest
  } = props;

  return withLink ? (
    <Link href={{ pathname: href }}>
      <button
        {...rest}
        className={`${styles[variant]} ${styles[color]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </Link>
  ) : (
    <button
      {...rest}
      className={`${styles[variant]} ${styles[color]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
