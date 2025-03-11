import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "../public/styles/globals.css";
import localFont from "next/font/local";
import { LayoutProvider, Auth } from "@/components";

const inter = localFont({
  src: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Proof",
  description:
    "PROOF is the world’s first remote, fully observed drug & alcohol testing solution that is Effortless, Accurate, Secure, and Defensible.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutProvider>
          <Auth>{children}</Auth>
        </LayoutProvider>
      </body>
    </html>
  );
}
