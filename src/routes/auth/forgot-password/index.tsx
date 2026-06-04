import { env } from "@/env";
import { useRequestPasswordReset } from "@/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  authButtonClassName,
  authInputClassName,
  AuthPage,
} from "../-authUi";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

type ForgotPasswordSchema = z.output<typeof forgotPasswordSchema>;

export const Route = createFileRoute("/auth/forgot-password/")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [requested, setRequested] = useState(false);
  const requestReset = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordSchema) => {
    const configuredCallbackUrl = env.VITE_AUTH_CALLBACK_URL;
    const configuredOrigin = configuredCallbackUrl
      ? new URL(configuredCallbackUrl).origin
      : undefined;
    const fallbackOrigin =
      typeof window === "undefined" ? undefined : window.location.origin;
    const redirectOrigin = configuredOrigin ?? fallbackOrigin;
    const redirectTo = redirectOrigin
      ? `${redirectOrigin}/auth/reset-password`
      : "/auth/reset-password";

    requestReset.mutate(
      {
        email: values.email,
        redirectTo,
      },
      {
        onSuccess: () => {
          setRequested(true);
        },
        onError: () => {
          setRequested(true);
          toast.error("Unable to request reset right now. Please try again.");
        },
      },
    );
  };

  return (
    <AuthPage
      title="Forgot your password?"
      description="Enter your email address and we will send you a reset link."
      footer={
        <p className="text-base">
          Back to{" "}
          <Link to="/auth/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" className={authInputClassName} required {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <button type="submit" className={authButtonClassName} disabled={requestReset.isPending}>
          Send reset link
        </button>

        {requested && (
          <p className="rounded-lg bg-neutral-100 p-3 text-sm text-neutral-700">
            If this email exists, check your inbox for a reset link.
          </p>
        )}
      </form>
    </AuthPage>
  );
}
