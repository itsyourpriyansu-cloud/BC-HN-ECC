import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";
import "./globals.css";


const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

import { AppProviders } from "@/components/providers/AppProviders";
import { ScrollProvider } from "@/components/providers/ScrollProvider";
import { PWAProvider } from "@/app/pwa-provider";
import Header from "@/components/layout/Header";
import MobileTabBar from "@/components/layout/MobileTabBar";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthModal from "@/components/auth/AuthModal";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { ToastContainer } from "@/components/layout/ToastContainer";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Alemah — Premium Direct-to-Consumer Home Textiles",
  description: "Explore premium bedsheets, cushion covers, quilts, comforters, curtains, and table linen. Woven with absolute craftsmanship, direct from our looms to your home.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alemah",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground text-sans pb-16 md:pb-0">
        <AppProviders>
          <PWAProvider>
            <ScrollProvider>
              <ToastContainer />
              <Header />
              <main className="flex-1 flex flex-col w-full">
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <AuthModal />
              <PWAInstallPrompt />
              <MobileTabBar />
            </ScrollProvider>
          </PWAProvider>
        </AppProviders>
      </body>
    </html>
  );
}
