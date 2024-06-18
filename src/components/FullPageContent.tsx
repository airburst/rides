import React from "react";

type Props = {
  children: JSX.Element;
};

export const FullPageContent: React.FC<Props> = ({ children }) => (
  <main className="mt-16 flex w-full min-h-[calc(100vh_-_64px)] md:min-h-[calc(100vh_-_96px)] lg:min-h-[calc(100vh_-_128px)] flex-col items-center text-neutral-500 text-lg sm:mt-24 md:px-4]">
    {children}
  </main>
);
