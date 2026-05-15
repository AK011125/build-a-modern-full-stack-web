import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jee-college-predictor-gray.vercel.app"),
  title: {
    default: "JEE College Predictor | NIT, IIIT, GFTI & State B.Tech Cutoffs",
    template: "%s | JEE College Predictor",
  },
  description:
    "Predict B.Tech colleges from JEE Main rank with NIT, IIIT, GFTI, state and private college data, quota filters, fees, placements and comparison tools.",
  keywords: [
    "JEE college predictor",
    "JoSAA cutoff",
    "CSAB cutoff",
    "NIT cutoff",
    "IIIT cutoff",
    "B.Tech college predictor",
  ],
  openGraph: {
    title: "JEE College Predictor",
    description: "Rank-based B.Tech college recommendations with quota, category, branch, fees and placement filters.",
    url: "https://jee-college-predictor-gray.vercel.app",
    siteName: "JEE College Predictor",
    images: ["/hero-counselling-dashboard.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
