import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AK Enterprises | Luxury Real Estate in Ambernath",
    template: "%s | AK Enterprises",
  },
  description:
    "Discover curated luxury living spaces where modern architecture meets suburban serenity. AK Enterprises offers premium properties in Ambernath, Maharashtra.",
  keywords: [
    "luxury real estate",
    "Ambernath properties",
    "premium apartments",
    "luxury homes",
    "residential properties",
    "commercial spaces",
  ],
  authors: [{ name: "AK Enterprises" }],
  openGraph: {
    title: "AK Enterprises | Luxury Real Estate in Ambernath",
    description:
      "Discover curated luxury living spaces where modern architecture meets suburban serenity.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} bg-surface text-on-surface min-h-screen flex flex-col antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
