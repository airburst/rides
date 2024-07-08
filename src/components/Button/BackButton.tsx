"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

type ButtonProps = {
  url?: string;
  className?: string;
};

export const BackButton = ({ url, className, ...props }: ButtonProps) => {
  const router = useRouter();

  const goBack = () => {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  };

  return (
    <Button primary {...props} className={className} onClick={goBack}>
      <ChevronLeft className="w-8 h-8" />
      BACK
    </Button>
  );
};
