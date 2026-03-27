import { SectionHeader } from "../SectionHeader";

type Props = {
  children: React.ReactNode;
};

export const DateHeader = ({ children }: Props) => (
  <SectionHeader className="snap-start scroll-mt-20">{children}</SectionHeader>
);
