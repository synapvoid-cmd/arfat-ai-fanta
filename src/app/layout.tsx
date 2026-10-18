import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import ToastContainer from "@/components/ui/Toast";
import CartModal from "@/components/ui/CartModal";
import StoreModal from "@/components/ui/StoreModal";
import StickyNav from "@/components/ui/StickyNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanta Guaraná Zero Sugar",
  description: "Bold guaraná taste. Zero sugar. Feel the rush.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
          <UIProvider>
            <StickyNav />
            {children}
            <ToastContainer />
            <CartModal />
            <StoreModal />
          </UIProvider>
        </body>
    </html>
  );
}
