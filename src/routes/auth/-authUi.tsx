import { MainContent } from "@/components/Layout/MainContent";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type AuthPageProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const authInputClassName =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export const authButtonClassName =
  "inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90";

export const authButtonSecondaryClassName =
  "inline-flex w-full items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2 font-semibold text-neutral-700 transition hover:bg-neutral-50";

export function AuthPage({ title, description, children, footer }: AuthPageProps) {
  return (
    <MainContent>
      <section className="w-full max-w-xl px-3 py-6 sm:px-0 sm:py-10">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-md sm:p-8">
          <header className="mb-6 space-y-2">
            <h1 className="text-3xl font-bold tracking-wide text-neutral-700">{title}</h1>
            <p className="text-base text-neutral-600">{description}</p>
          </header>

          <div className="space-y-5">{children}</div>

          {footer && <footer className={cn("mt-6 border-t border-neutral-200 pt-5")}>{footer}</footer>}
        </div>
      </section>
    </MainContent>
  );
}
