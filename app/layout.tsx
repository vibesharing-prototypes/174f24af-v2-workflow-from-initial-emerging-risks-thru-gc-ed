import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GC Command Center - Emerging Risk Alert",
  description: "General Counsel Command Center prototype for emerging risk detection and response workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
