"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/useUIStore";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const isOpen = useUIStore((state) => state.cartOpen);
  const setOpen = useUIStore((state) => state.setCartOpen);
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingCost,
    totalAmount,
    freeShippingProgress,
  } = useCart();

  if (!isOpen) return null;

  const FREE_SHIPPING_LIMIT = 1500;
  const neededForFreeShipping = FREE_SHIPPING_LIMIT - subtotal;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full sm:max-w-md h-full bg-background border-l border-alemah-sand/40 flex flex-col shadow-2xl animate-slide-left relative textile-pattern"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-alemah-sand/30 flex justify-between items-center bg-alemah-cream/15">
          <div className="flex items-center gap-2 text-alemah-espresso">
            <ShoppingBag className="w-5 h-5 text-alemah-red-600" />
            <h3 className="font-serif text-lg font-bold">Your Bag</h3>
            <span className="text-xs font-sans text-alemah-taupe font-medium">({items.length} items)</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-alemah-espresso hover:bg-alemah-sand/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {items.length > 0 && (
          <div className="p-4 bg-alemah-red-050 border-b border-alemah-red-100/50 flex flex-col gap-2 font-sans text-xs">
            <div className="flex justify-between items-center text-alemah-espresso">
              {neededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-alemah-red-600">₹{neededForFreeShipping}</strong> more for{" "}
                  <strong>FREE Delivery</strong>
                </span>
              ) : (
                <span className="text-ios-green font-semibold">Congratulations! You've unlocked FREE shipping. 🎉</span>
              )}
              <span className="text-[10px] text-alemah-taupe font-medium">Goal: ₹{FREE_SHIPPING_LIMIT}</span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-alemah-sand/30 overflow-hidden">
              <div
                className="h-full bg-alemah-red-600 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-alemah-cream flex items-center justify-center text-alemah-taupe">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-alemah-espresso">Your bag is empty</h4>
                <p className="font-sans text-xs text-alemah-taupe mt-1 max-w-[240px]">
                  Explore our luxury sheets, comforters, and cushions to elevate your space.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 h-11 px-6 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full ios-active-scale transition-colors shadow-sm cursor-pointer"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 p-3.5 rounded-2xl bg-alemah-cream/25 border border-alemah-sand/35"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-alemah-cream shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h5 className="font-sans font-semibold text-sm text-alemah-espresso line-clamp-1">
                        {item.name}
                      </h5>
                      <p className="font-sans text-[11px] text-alemah-taupe mt-0.5">
                        Size: {item.size.split(" (")[0]} &bull; Color: {item.color}
                      </p>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => {
                        removeFromCart(item.variantId);
                      }}
                      className="p-1 text-alemah-taupe hover:text-ios-red rounded-full transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-alemah-sand rounded-lg h-7 bg-background px-1">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.variantId, item.quantity - 1);
                          } else {
                            removeFromCart(item.variantId);
                          }
                        }}
                        className="p-1 text-alemah-espresso hover:bg-alemah-cream rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-sans text-xs font-semibold px-2.5 min-w-[24px] text-center text-alemah-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (item.quantity < item.stock) {
                            updateQuantity(item.variantId, item.quantity + 1);
                          }
                        }}
                        className="p-1 text-alemah-espresso hover:bg-alemah-cream rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-sans font-bold text-sm text-alemah-espresso">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-alemah-sand/30 bg-alemah-cream/15 flex flex-col gap-4 font-sans text-sm">
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-alemah-taupe">
                <span>Subtotal</span>
                <span className="text-alemah-espresso font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-alemah-taupe">
                <span>Shipping</span>
                <span className="text-alemah-espresso font-semibold">
                  {shippingCost === 0 ? <span className="text-ios-green">FREE</span> : `₹${shippingCost}`}
                </span>
              </div>
              <div className="border-t border-alemah-sand/30 my-1"></div>
              <div className="flex justify-between text-base font-bold text-alemah-espresso">
                <span>Total Amount</span>
                <span className="text-alemah-red-600">₹{totalAmount}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="w-full h-12 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold rounded-full ios-active-scale transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
