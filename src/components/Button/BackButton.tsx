"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

type ButtonProps = {
  url?: string;
  className?: string;
  noIcon?: boolean;
};

export const BackButton = ({ url, className, noIcon = false, ...props }: ButtonProps) => {
  const router = useRouter();
  const showIcon = !noIcon

  const goBack = () => {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  };

  return (
    <Button primary {...props} className={className} onClick={goBack}>
      {showIcon && <ChevronLeft className="w-6 h-6" />}
      BACK
    </Button>
  );
};
