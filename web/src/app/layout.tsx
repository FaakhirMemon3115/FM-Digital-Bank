import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FM Digital Bank",
  description: "Pakistan ka smart digital wallet",
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
