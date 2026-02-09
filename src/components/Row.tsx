import { memo, type JSX } from "react";

type RowProps = {
  children: JSX.Element | JSX.Element[] | null | undefined;
};

export const Row = memo(({ children }: RowProps) => (
  <div className="grid w-full grid-cols-[100px_1fr] items-center justify-between gap-2 px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4">
    {children}
  </div>
));

Row.displayName = "Row";
