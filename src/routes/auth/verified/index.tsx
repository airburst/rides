import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleCheckBig } from "lucide-react";
import { AuthPage, authButtonClassName } from "../-authUi";

export const Route = createFileRoute("/auth/verified/")({
  component: VerifiedPage,
});

function VerifiedPage() {
  return (
    <AuthPage
      title="Email verified"
      description="Your account is ready. You can now log in."
    >
      <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-neutral-700">
        <CircleCheckBig className="h-7 w-7 text-success" />
        <p className="text-base">Verification complete.</p>
      </div>

      <Link to="/auth/login" className={authButtonClassName}>
        Log in
      </Link>
    </AuthPage>
  );
}
