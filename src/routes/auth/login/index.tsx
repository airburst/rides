import { useBetterAuthLogin } from "@/hooks/auth";
import { ApiError } from "@/lib/api";
import { useAuth0 } from "@auth0/auth0-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  authButtonClassName,
  authButtonSecondaryClassName,
  authInputClassName,
  AuthPage,
} from "../-authUi";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchema = z.output<typeof loginSchema>;

export const Route = createFileRoute("/auth/login/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const login = useBetterAuthLogin();
  const [serverError, setServerError] = useState<
    "INVALID_EMAIL_OR_PASSWORD" | "EMAIL_NOT_VERIFIED" | null
  >(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");

  const onSubmit = (values: LoginSchema) => {
    setServerError(null);

    login.mutate(values, {
      onSuccess: () => {
        void navigate({ to: "/" });
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "";

        if (error instanceof ApiError && error.status === 401) {
          if (message === "INVALID_EMAIL_OR_PASSWORD") {
            setServerError("INVALID_EMAIL_OR_PASSWORD");
            return;
          }
        }

        if (error instanceof ApiError && error.status === 403) {
          if (message === "EMAIL_NOT_VERIFIED") {
            setServerError("EMAIL_NOT_VERIFIED");
            return;
          }
        }

        toast.error("Could not log in. Please try again.");
      },
    });
  };

  return (
    <AuthPage
      title="Log in"
      description="Sign in with your email and password to manage rides and membership."
      footer={
        <div className="space-y-3 text-base">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/auth/signup/$slug" params={{ slug: "bcc" }} className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link to="/auth/forgot-password" className="font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {serverError === "INVALID_EMAIL_OR_PASSWORD" && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-neutral-700">
            Incorrect email or password.
          </div>
        )}

        {serverError === "EMAIL_NOT_VERIFIED" && (
          <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-neutral-700">
            Please verify your email first. {" "}
            <Link
              to="/auth/verify-pending"
              search={{ email }}
              className="font-semibold text-primary hover:underline"
            >
              Resend link
            </Link>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" className={authInputClassName} required {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Password
          </label>
          <input id="password" type="password" autoComplete="current-password" className={authInputClassName} required {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className={authButtonClassName} disabled={login.isPending}>
          Log in
        </button>

        <button type="button" className={authButtonSecondaryClassName} onClick={() => void loginWithRedirect()}>
          Existing member? Log in with Auth0
        </button>
      </form>
    </AuthPage>
  );
}
