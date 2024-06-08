import { useSession } from "next-auth/react";
import { Header } from "./Header";
import { MainContent } from "./MainContent";

type Props = {
  children: JSX.Element;
};

export const Layout: React.FC<Props> = ({ children }: Props) => {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const role = session?.user?.role as string;
  return (
    <div className="text-lg">
      <Header isAuthenticated={isAuthenticated} role={role} />
      <MainContent>{children}</MainContent>
    </div>
  );
};
