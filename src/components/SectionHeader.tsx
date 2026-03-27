import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SectionHeader = ({ children, className }: Props) => (
  <div
    className={cn(
      "flex w-full px-2 font-bold uppercase tracking-widest sm:rounded text-sm lg:text-lg",
      className,
    )}
  >
    <div>{children}</div>
  </div>
);
