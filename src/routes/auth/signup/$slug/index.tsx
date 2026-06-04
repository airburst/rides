import { useSignup } from "@/hooks/auth";
import { ApiError } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  authButtonClassName,
  authInputClassName,
  AuthPage,
} from "../../-authUi";

const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupSchema = z.output<typeof signupSchema>;

export const Route = createFileRoute("/auth/signup/$slug/")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { slug } = Route.useParams();
  const signup = useSignup(slug);
  const [showLoginLink, setShowLoginLink] = useState(false);
  const clubSlug = slug.toUpperCase();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignupSchema) => {
    setShowLoginLink(false);

    signup.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          void navigate({
            to: "/auth/verify-pending",
            search: { email: values.email },
          });
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 409) {
            setShowLoginLink(true);
            toast.error("Account already exists. Please log in instead.");
            return;
          }

          if (error instanceof ApiError && error.status === 400) {
            setError("root.serverError", {
              type: "server",
              message: error.message || "Please check your details and try again",
            });
            return;
          }

          toast.error("Something went wrong, please try again");
        },
      },
    );
  };

  return (
    <AuthPage
      title="Create your account"
      description={`Join ${clubSlug} with your name, email, and a password.`}
      footer={
        <p className="text-base">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.serverError?.message && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-neutral-700">
            {errors.root.serverError.message}
          </div>
        )}

        {showLoginLink && (
          <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-neutral-700">
            Already have an account? {" "}
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              Log in instead
            </Link>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Name
          </label>
          <input id="name" type="text" autoComplete="name" className={authInputClassName} required {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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
          <input id="password" type="password" autoComplete="new-password" className={authInputClassName} required {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={authInputClassName}
            required
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className={authButtonClassName} disabled={signup.isPending}>
          Create account
        </button>
      </form>
    </AuthPage>
  );
}
