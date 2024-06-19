import React from "react";

type Props = {
  children: JSX.Element;
};

export const FullPageContent: React.FC<Props> = ({ children }) => (
  <main className="mt-16 flex w-full max-h-[calc(100svh_-_64px)] md:max-h-[calc(100svh_-_96px)] flex-col items-center text-neutral-500 text-lg sm:mt-24 md:px-4]">
    {children}
  </main>
);
