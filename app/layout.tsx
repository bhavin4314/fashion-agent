import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vistra | Premium Fashion Concierge",
  description: "Secure Admin & User Portal for Vistra Premium Fashion Concierge.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "12px",
            boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.15)",
          }
        }} />
      </body>
    </html>
  );
}
