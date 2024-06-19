import React from "react";

type Props = {
  children: JSX.Element;
};

export const FullPageContent: React.FC<Props> = ({ children }) => (
  <main className="mt-16 flex w-full h-[calc(100vh_-_64px)] md:h-[calc(100vh_-_96px)] flex-col items-center text-neutral-500 text-lg sm:mt-24 md:px-4]">
    {children}
  </main>
);
