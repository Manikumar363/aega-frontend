import type { Metadata } from "next";

import Header from "@/components/layout/Header"; // Adjust import path as needed
import Footer from "@/components/layout/Footer"; // Adjust import path as needed

export const metadata: Metadata = {
  title: "AEGA - Global Alliance",
  description: "Agents & Educators Global Alliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#03091F] ">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}