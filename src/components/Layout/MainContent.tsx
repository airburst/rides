import React, { type JSX } from "react";

type Props = {
  children: JSX.Element;
};

export const MainContent: React.FC<Props> = ({ children }) => (
  <main className="container mx-auto mt-16 lg:mt-32 flex w-full h-[calc(100svh-64px)] md:h-[calc(100svh-96px)] lg:h-[calc(100svh-128px)] overflow-y-scroll snap-y snap-mandatory flex-col items-center text-mist-600 text-lg sm:mt-24 md:px-4 lg:max-w-5xl">
    {children}
  </main>
);
