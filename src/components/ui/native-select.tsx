import * as React from "react";

import { cn } from "@/lib/utils";

function NativeSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "border-input bg-transparent text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full appearance-none rounded-md border px-3 py-1 shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { NativeSelect };
