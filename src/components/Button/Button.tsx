/* eslint-disable react/button-has-type */
import { forwardRef, type ReactNode } from "react";
import clsx from "clsx";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  text?: string;
  ariaLabel?: string;
  children?: ReactNode;
  loading?: boolean;
  link?: boolean;
  disabled?: boolean;
  primary?: boolean;
  secondary?: boolean;
  accent?: boolean;
  info?: boolean;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      text,
      children,
      loading,
      link,
      disabled,
      ariaLabel,
      onClick,
      primary,
      secondary,
      accent,
      info,
      success,
      warning,
      error,
    },
    ref
  ) => {
    const classes = clsx(
      "btn",
      { "btn-primary": primary },
      { "btn-secondary": secondary },
      { "btn-accent": accent },
      { "btn-info": info },
      { "btn-success": success },
      { "btn-warning": warning },
      { "btn-error": error },
      { "btn-link": link },
      { "btn-disabled": disabled },
      { loading },
      "gap-2"
    );

    return (
      <button
        className={classes}
        type={type}
        ref={ref}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={disabled}
      >
        {text || children}
      </button>
    );
  }
);
