import React from "react";

type Props = {
  children: JSX.Element;
};

export const MainContent: React.FC<Props> = ({ children }) => (
  <main className="container mx-auto mt-16 lg:mt-32 flex w-full min-h-[calc(100vh_-_32)] flex-col items-center pb-16 text-neutral-500 sm:mt-24 md:px-4 lg:max-w-[1024px]">
    {children}
  </main>
);
