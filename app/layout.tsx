import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster as ToastMsg } from "react-hot-toast";
import ScrollToTopButton from "./components/TopScroller";

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/Poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "../public/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "COLT & CO. - Your One-Stop Shop for Everything!",
  description:
    "A full-featured e-commerce application where users can browse products, add them to a cart, and make purchases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={`${poppins.variable} ${playfairDisplay.variable}`}>
          <NextAuthSessionProvider>
            <ReduxProvider>
              <Navbar />
              <ToastMsg position="bottom-right" />
              <div className="pt-[100px] md:pt-[180px]">
                {children}
              </div>
              <ScrollToTopButton />
              <Toaster />
            </ReduxProvider>
          </NextAuthSessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
