import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const interFont = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "E - Cash",
    description: "Cashier App",
};

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
        <body className={`${interFont.variable} antialiased bg-gray-100 scroll-smooth`}>
            {children}
        </body>
    </html>
  );
}
