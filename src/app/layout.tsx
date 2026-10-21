import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import "./prototype.css";
import "./home.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SvgIcons from "@/components/layout/SvgIcons";
import SEO from "@/components/seo";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trustvalue.ai"),
  title: "TrustValue.ai: The Global Trust Index | Universal Consumer & Corporate Trust Telemetry",
  description:
    "The Global Trust Index across all consumer-critical industries. Check any brand, contract, policy, or loan before you sign. Phase 1 live audit: Life & Health Insurance. Rate yours in 7 seconds.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "TrustValue.ai: The Global Trust Index",
    description: "Know before you trust. Universal consumer & corporate trust telemetry across all consumer-critical industries.",
    url: "https://trustvalue.ai",
    siteName: "TrustValue.ai",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustValue.ai: The Global Trust Index",
    description: "Know before you trust. Universal consumer & corporate trust telemetry.",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <SEO />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased bg-[#FAFBFD] text-[#06132F]">
        <SvgIcons />

        <SmoothScrollProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main" className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
