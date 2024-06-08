type Props = {
  children: JSX.Element;
};

export const LayoutEmbedded = ({ children }: Props) => (
  <main className="container mx-auto  flex w-full flex-col items-center justify-center text-neutral-500 md:px-4 lg:max-w-[1024px] text-lg">
    {children}
  </main>
);
