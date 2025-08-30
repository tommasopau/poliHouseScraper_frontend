import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rental-app",
  description: "A rental application built with Next.js",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
