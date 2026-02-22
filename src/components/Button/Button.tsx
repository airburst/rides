import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import {
  Button as ShadButton,
  type buttonVariants,
} from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

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

function resolveVariant(props: ButtonProps): Variant {
  if (props.primary) return "default";
  if (props.secondary) return "secondary";
  if (props.accent) return "accent";
  if (props.info) return "info";
  if (props.success) return "success";
  if (props.warning) return "warning";
  if (props.error) return "destructive";
  if (props.link) return "link";
  return "default";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = "button",
      text,
      children,
      loading,
      link: _link,
      disabled,
      ariaLabel,
      onClick,
      primary: _primary,
      secondary: _secondary,
      accent: _accent,
      info: _info,
      success: _success,
      warning: _warning,
      error: _error,
    },
    ref,
  ) => {
    const variant = resolveVariant({
      primary: _primary,
      secondary: _secondary,
      accent: _accent,
      info: _info,
      success: _success,
      warning: _warning,
      error: _error,
      link: _link,
    });

    const upperText = text?.toUpperCase();
    const buttonContent = children ?? upperText;

    return (
      <ShadButton
        variant={variant}
        className={cn("min-h-16 h-full rounded-sm text-base", className)}
        type={type}
        ref={ref}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={disabled}
      >
        {loading ? (
          <LoaderCircle className="size-6 animate-spin" />
        ) : (
          buttonContent
        )}
      </ShadButton>
    );
  },
);

Button.displayName = "Button";
