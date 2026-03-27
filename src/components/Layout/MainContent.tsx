import React, { type JSX } from "react";

type Props = {
  children: JSX.Element;
};

export const MainContent: React.FC<Props> = ({ children }) => (
  <main className="container mx-auto flex w-full flex-col items-center text-neutral-600 text-lg md:px-4 lg:max-w-5xl">
    {children}
  </main>
);
