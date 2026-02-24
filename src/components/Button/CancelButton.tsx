import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";

export const CancelButton = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const router = useRouter();

  return (
    <Button
      className={cn("min-h-16 h-full rounded-sm text-base", className)}
      type="button"
      onClick={() => router.history.back()}
      {...props}
    >
      CANCEL
    </Button>
  );
};
