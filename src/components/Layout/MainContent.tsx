import React, { type JSX } from "react";

type Props = {
  children: JSX.Element;
};

export const MainContent: React.FC<Props> = ({ children }) => (
  <main className="container mx-auto mt-16 lg:mt-32 flex w-full min-h-[calc(100svh-64px)] md:min-h-[calc(100svh-96px)] lg:min-h-[calc(100svh-128px)] flex-col items-center text-neutral-500 text-lg sm:mt-24 md:px-4 lg:max-w-5xl">
    {children}
  </main>
);
