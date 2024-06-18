import "@/styles/globals.css";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <body className="h-[100vh]">
      {children}
      <Toaster position="bottom-center" />
    </body>

  );
}