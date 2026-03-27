import {
  Button as ShadButton,
  type buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { forwardRef, type ReactNode } from "react";

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
  outline?: boolean;
  error?: boolean;
}

function resolveVariant(props: ButtonProps): Variant {
  if (props.primary) return "default";
  if (props.secondary) return "secondary";
  if (props.outline) return "outline";
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
      outline: _outline,
      error: _error,
    },
    ref,
  ) => {
    const variant = resolveVariant({
      primary: _primary,
      secondary: _secondary,
      error: _error,
      outline: _outline,
      link: _link,
    });

    const upperText = text?.toUpperCase();
    const buttonContent = children ?? upperText;
    const buttonClasses = cn(
      "min-h-12 h-full rounded-sm text-base",
      variant === "secondary" ? "text-foreground" : "text-white",
      variant === "link" && "text-primary",
      variant === "outline" &&
        "text-foreground hover:text-foreground bg-transparent border-2 border-primary",
      className,
    );

    return (
      <ShadButton
        variant={variant}
        className={buttonClasses}
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
