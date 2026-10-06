import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trustvalue.ai"),
  title: "TrustValue.ai — Founding Prototype",
  description:
    "TrustValue.ai — a founding prototype for turning real human experience into measurable trust.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "TrustValue.ai — Founding Prototype",
    description:
      "Turning genuine human experience into measurable trust in seconds.",
    url: "https://trustvalue.ai",
    siteName: "TrustValue.ai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustValue.ai — Founding Prototype",
    description:
      "Turning genuine human experience into measurable trust in seconds.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
