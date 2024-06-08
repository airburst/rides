import { useRouter } from "next/router";
import { Button } from "./Button";
import { ChevronLeftIcon } from "../Icon";

type ButtonProps = {
  url?: string;
};

export const BackButton = ({ url, ...props }: ButtonProps) => {
  const router = useRouter();

  const goBack = () => {
    if (url) {
      router.push(url);
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
