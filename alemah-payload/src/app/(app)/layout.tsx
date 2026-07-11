import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { AdminBar } from '@/components/AdminBar'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import React from 'react'
import './globals.css'

// Alemah layout components (migrated from AMH-ECC)
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/Cart/CartDrawer'
import MobileTabBar from '@/components/MobileTabBar'
import { ToastContainer } from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: {
    default: 'Alemah — Premium Home Textiles',
    template: '%s | Alemah',
  },
  description:
    'Premium bedsheets, cushion covers, quilts, comforters, curtains, and table linen. Woven with absolute craftsmanship, direct from our looms to your home.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Alemah',
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          {/* Toast notifications */}
          <ToastContainer />

          {/* Sticky header */}
          <Header />

          {/* Page content */}
          <main className="flex-1 flex flex-col w-full pb-16 md:pb-0">{children}</main>

          {/* Footer (desktop) */}
          <Footer />

          {/* Cart Drawer overlay */}
          <CartDrawer />

          {/* Mobile tab bar */}
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  )
}
