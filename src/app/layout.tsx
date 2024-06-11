import { Header } from "@/components";
import { RideGroupSkeleton } from "@/components/RideGroupSkeleton";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`,
  icons: [
    { rel: "favicon", url: "/static/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/static/favicon-32x32.png" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession()

  return (
    <html lang="en" className={`${outfit.variable}`} data-theme="club">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="author" content="Mark Fairhurst" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content="Mo-wRmOnufCVny2ZCkZG6iEZhuO0GMB5jLGUJJ6Ne_0"
        />
      </head>
      <body>
        <Header user={session?.user} />
        <Suspense fallback={<RideGroupSkeleton />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
