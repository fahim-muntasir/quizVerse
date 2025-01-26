import type { Metadata } from "next";
import { DM_Sans, Goldman } from "next/font/google";
import StoreProvider from "@/components/StoreProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"], // Specify subsets
  weight: ["400", "500", "700"], // Specify weights (optional)
  variable: "--font-dm-sans", // Define a CSS variable for Tailwind integration
});

const goldman = Goldman({
  subsets: ["latin"], // Specify subsets
  weight: ["400", "700"], // Specify weights (optional)
  variable: "--font-goldman", // Define a CSS variable for Tailwind integration
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${dmSans.variable} ${goldman.variable} antialiased`}>
        <StoreProvider>{children}</StoreProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <div id="modal-portal"></div>
      </body>
    </html>
  );
}
