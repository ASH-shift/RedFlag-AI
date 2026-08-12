import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RedFlag AI — Know Before You Join",
  description:
    "AI-powered job description analyzer that detects toxic workplace culture signals, red flags, and gives you negotiation tips before you apply.",
  openGraph: {
    title: "RedFlag AI — Know Before You Join",
    description: "Detect toxic culture signals in any job description — instantly.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
