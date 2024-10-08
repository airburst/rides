import { Header } from "@/components/Header/Header";
import { env } from "@/env";
import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const APP_NAME = `${env.NEXT_PUBLIC_CLUB_SHORT_NAME} Rides`;

export const metadata: Metadata = {
  title: APP_NAME,
  description: `${env.NEXT_PUBLIC_CLUB_LONG_NAME} Ride Planner`,
  icons: [
    { rel: "favicon", url: "/static/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/static/favicon-32x32.png",
    },
    // apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Header />
        {children}
        <Toaster position="bottom-center" />
        <SpeedInsights />
      </body>
    </html>
  );
}
