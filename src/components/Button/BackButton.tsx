import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "./Button";

type ButtonProps = {
  label?: string;
  url?: string;
  className?: string;
  noIcon?: boolean;
};

export const BackButton = ({
  label = "BACK",
  url,
  className,
  noIcon = false,
  ...props
}: ButtonProps) => {
  const router = useRouter();
  const showIcon = !noIcon;

  const goBack = () => {
    if (url) {
      void router.navigate({ to: url });
    } else {
      router.history.back();
    }
  };

  return (
    <Button {...props} secondary className={className} onClick={goBack}>
      {showIcon && <ChevronLeft className="h-6 w-6" />}
      {label}
    </Button>
  );
};
