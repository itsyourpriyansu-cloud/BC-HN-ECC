'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, Heart, User } from 'lucide-react'
import { usePayloadAuth } from '@/hooks/usePayloadAuth'

export default function MobileTabBar() {
  const pathname = usePathname()
  const { user } = usePayloadAuth()

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: Grid },
    { name: 'Wishlist', href: '/account?tab=wishlist', icon: Heart },
    { name: 'Account', href: user ? '/account' : '/login', icon: User },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-xl border-t border-alemah-sand/30 pb-safe-bottom">
      <div className="h-16 flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href.split('?')[0])

          const Icon = tab.icon

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ios-active-scale cursor-pointer ${
                isActive ? 'text-alemah-red-600' : 'text-alemah-taupe'
              }`}
            >
              <Icon className={`w-5.5 h-5.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              <span className="text-[10px] font-sans font-medium mt-0.5">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
