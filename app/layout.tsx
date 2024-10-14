import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../public/styles/globals.css";
import { LayoutProvider, Auth } from "@/components";

const inter = Inter({ subsets: ["latin"] });

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
