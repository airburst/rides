import React, { type JSX } from "react";

type Props = {
  children: JSX.Element;
};

export const FullPageContent: React.FC<Props> = ({ children }) => (
  <main className="flex w-full h-full flex-col items-center text-neutral-500 text-lg sm:mt-24 md:px-4]">
    {children}
  </main>
);
