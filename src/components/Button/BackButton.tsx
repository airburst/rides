"use client";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "../Icon";
import { Button } from "./Button";

type ButtonProps = {
  url?: string;
};

export const BackButton = ({ url, ...props }: ButtonProps) => {
  const router = useRouter();

  const goBack = async () => {
    if (url) {
      await router.push(url);
    } else {
      router.back();
    }
  };

  return (
    <Button primary {...props} onClick={goBack}>
      <ChevronLeftIcon className="fill-white" />
      Back
    </Button>
  );
};
