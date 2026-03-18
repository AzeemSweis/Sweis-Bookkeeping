import type { Metadata } from "next";
import { PT_Serif, Montserrat } from "next/font/google";
import "./globals.css";

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hanna Sweis Bookkeeping | Las Vegas, NV",
  description:
    "Professional bookkeeping services for small businesses in Las Vegas. Nearly 20 years of experience helping business owners stay on top of their finances.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Hanna Sweis Bookkeeping | Las Vegas, NV",
    description:
      "Professional bookkeeping services for small businesses in Las Vegas.",
    url: "https://hannasweis.com",
    siteName: "Hanna Sweis Bookkeeping",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ptSerif.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
