'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'

export default function Footer() {
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'Bedsheets', href: '/shop/Bedsheets' },
        { name: 'Cushion Covers', href: '/shop/Cushion Covers' },
        { name: 'Quilts & Comforters', href: '/shop/Quilts & Comforters' },
        { name: 'Curtains', href: '/shop/Curtains' },
        { name: 'Table Linen', href: '/shop/Table & Kitchen Linen' },
      ],
    },
    {
      title: 'Our Story',
      links: [
        { name: 'Our Heritage', href: '/story' },
        { name: 'Artisans & Craft', href: '/story#artisans' },
        { name: 'Organic Materials', href: '/story#organic' },
        { name: 'Sustainability', href: '/story#sustainability' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help & FAQ', href: '/faq' },
        { name: 'Shipping & Delivery', href: '/faq#shipping' },
        { name: 'Easy Return Policy', href: '/terms#returns' },
        { name: 'Track Your Order', href: '/account' },
        { name: 'Contact Support', href: '/faq#contact' },
      ],
    },
  ]

  return (
    <footer className="w-full bg-alemah-ivory border-t border-alemah-sand/40 font-sans text-alemah-espresso mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <span className="font-serif text-xl font-bold text-alemah-red-600 tracking-wider">
              ALEMAH
            </span>
            <p className="text-xs text-alemah-taupe leading-relaxed">
              Premium home textile brand crafting luxury bedding, quilts, and cushion covers using
              organic long-staple cotton and legacy block print techniques.
            </p>
            <div className="flex gap-4 items-center text-xs text-alemah-taupe font-medium mt-2">
              <Globe className="w-4 h-4 text-alemah-red-600" />
              <span>India (INR)</span>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-alemah-espresso">
                {col.title}
              </h5>
              <ul className="flex flex-col gap-2.5 text-xs">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-alemah-taupe hover:text-alemah-red-600 hover:underline transition-colors cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-alemah-sand/30 my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-alemah-taupe font-medium">
          <div>
            <span>&copy; 2026 Alemah Textiles. All rights reserved.</span>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-alemah-red-600 hover:underline cursor-pointer">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-alemah-red-600 hover:underline cursor-pointer">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/faq" className="hover:text-alemah-red-600 hover:underline cursor-pointer">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
