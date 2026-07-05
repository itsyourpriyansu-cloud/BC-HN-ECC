"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const setCartOpen = useUIStore((state) => state.setCartOpen);
  const setAuthOpen = useUIStore((state) => state.setAuthOpen);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Bedsheets", href: "/shop/Bedsheets" },
    { name: "Cushion Covers", href: "/shop/Cushion Covers" },
    { name: "Quilts", href: "/shop/Quilts & Comforters" },
    { name: "Curtains", href: "/shop/Curtains" },
    { name: "Table Linen", href: "/shop/Table & Kitchen Linen" },
    { name: "Our Story", href: "/story" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full frosted-glass transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-alemah-espresso p-1 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Brand Title */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer select-none">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-red-600 tracking-wider">
              ALEMAH
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 font-sans font-medium text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 transition-colors cursor-pointer ${
                    isActive
                      ? "text-alemah-red-600"
                      : "text-alemah-taupe hover:text-alemah-espresso"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-alemah-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Icons Controls */}
          <div className="flex items-center space-x-3.5 sm:space-x-5">
            {/* Wishlist Link */}
            <Link
              href="/account?tab=wishlist"
              className="text-alemah-taupe hover:text-alemah-espresso p-1.5 transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Profile trigger */}
            {session ? (
              <Link
                href="/account"
                className="text-alemah-taupe hover:text-alemah-espresso p-1.5 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="My Account"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline text-xs font-sans font-medium max-w-[80px] truncate">
                  {session.user?.name}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="text-alemah-taupe hover:text-alemah-espresso p-1.5 transition-colors flex items-center gap-1 cursor-pointer"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="text-alemah-taupe hover:text-alemah-espresso p-1.5 transition-colors relative ios-active-scale cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-alemah-red-600 text-[10px] font-sans font-semibold text-white flex items-center justify-center border border-background shadow-sm animate-pulse-slow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-4/5 max-w-sm h-full bg-background p-6 flex flex-col gap-6 shadow-2xl animate-slide-right textile-pattern"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-alemah-sand/40">
              <span className="font-serif text-xl font-bold text-alemah-red-600 tracking-wider">ALEMAH</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-alemah-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-4 font-sans font-semibold text-lg text-alemah-espresso">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg hover:bg-alemah-cream/40 transition-colors ${
                    pathname === link.href ? "text-alemah-red-600 bg-alemah-red-100/50" : "text-alemah-espresso"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-alemah-sand/40">
              {session ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-3">
                    <div className="w-10 h-10 rounded-full bg-alemah-sand/40 flex items-center justify-center font-serif text-alemah-espresso font-bold">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-sm text-alemah-espresso">{session.user?.name}</p>
                      <p className="font-sans text-xs text-alemah-taupe">{session.user?.email || session.user?.phone}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 rounded-full border border-alemah-sand font-sans text-sm font-medium text-alemah-espresso flex items-center justify-center hover:bg-alemah-cream/50 transition-colors"
                  >
                    Go to Account
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="w-full h-11 rounded-full bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold flex items-center justify-center transition-colors shadow-sm"
                >
                  Log In or Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
