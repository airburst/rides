import "@/styles/globals.css";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="w-full">
      {children}
      <Toaster position="bottom-center" />
    </div>
  );
}