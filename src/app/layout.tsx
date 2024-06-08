import { Header } from "@/components";
import "@/styles/globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "BCC Ride Planner",
  description: "Bath Cycling Club Ride Planner",
  icons: [
    { rel: "icon", url: "/static/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/static/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/static/favicon-16x16.png" },
    // {
    //   rel: "apple-touch-icon",
    //   sizes: "180x180",
    //   href: "/static/apple-touch-icon.png"
    // },
    // { rel: "mask-icon", href: "/static/safari-pinned-tab.svg", color: "#5bbad5" },
    // { rel: "manifest", href: "/static/site.webmanifest" },
  ],
};

export default function RootLayout({
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
      </body>
    </html>
  );
}
