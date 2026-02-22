import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CancelButton = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const router = useRouter();

  return (
    <Button
      variant="neutral"
      className={cn("min-h-16 h-full rounded-sm text-base", className)}
      type="button"
      onClick={() => router.history.back()}
      {...props}
    >
      CANCEL
    </Button>
  );
};
