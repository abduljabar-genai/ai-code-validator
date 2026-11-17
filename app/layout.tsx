import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI HTML & CSS Validator for Students (W3C Inspired)",
  description: "A student-centered HTML and CSS validator powered by AI. Pinpoints errors with simple descriptions and educational guidance without giving away full solutions.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
