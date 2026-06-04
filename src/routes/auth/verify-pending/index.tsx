import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { z } from "zod";
import { authButtonSecondaryClassName, AuthPage } from "../-authUi";

const verifyPendingSearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/auth/verify-pending/")({
  validateSearch: (search) => verifyPendingSearchSchema.parse(search),
  component: VerifyPendingPage,
});

function VerifyPendingPage() {
  const { email } = Route.useSearch();

  return (
    <AuthPage
      title="Check your email"
      description="We sent a verification link to your inbox."
      footer={
        <Link to="/auth/login" className={authButtonSecondaryClassName}>
          Back to login
        </Link>
      }
    >
      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-700">
        <MailCheck className="h-7 w-7 text-primary" />
        <p className="text-base">
          {email ? `Verification email sent to ${email}.` : "Verification email sent."}
        </p>
      </div>
      <p className="text-base text-neutral-700">
        Click the link in your email to verify your account, then return here to log in. If you
        cannot find it, check your spam folder.
      </p>
    </AuthPage>
  );
}
