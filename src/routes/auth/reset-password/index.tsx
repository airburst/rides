import { useResetPassword } from "@/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  authButtonClassName,
  authInputClassName,
  AuthPage,
} from "../-authUi";

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
});

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.output<typeof resetPasswordSchema>;

export const Route = createFileRoute("/auth/reset-password/")({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const search = Route.useSearch();
  const token = search.token;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const hasInvalidToken = search.error === "INVALID_TOKEN";

  const onSubmit = (values: ResetPasswordSchema) => {
    if (!token) {
      toast.error("Reset link is missing or invalid. Request a new link.");
      return;
    }

    resetPassword.mutate(
      {
        token,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated");
          void navigate({ to: "/auth/login" });
        },
        onError: () => {
          toast.error("Reset failed, request a new link");
        },
      },
    );
  };

  return (
    <AuthPage
      title="Set a new password"
      description="Choose a new password for your account."
      footer={
        <p className="text-base">
          <Link to="/auth/forgot-password" className="font-semibold text-primary hover:underline">
            Request another reset link
          </Link>
        </p>
      }
    >
      {hasInvalidToken && (
        <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-neutral-700">
          This link has expired. Request a new reset email to continue.
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-semibold uppercase tracking-wide text-neutral-600">
            New password
          </label>
          <input id="newPassword" type="password" autoComplete="new-password" className={authInputClassName} required {...register("newPassword")} />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
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

        <button type="submit" className={authButtonClassName} disabled={resetPassword.isPending || !token}>
          Update password
        </button>
      </form>
    </AuthPage>
  );
}
