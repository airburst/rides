"use client";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "../Icon";
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
      <ChevronLeftIcon className="fill-white" />
      BACK
    </Button>
  );
};
