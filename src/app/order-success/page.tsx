"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("id");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center textile-pattern bg-background">
      <div className="max-w-md w-full flex flex-col items-center gap-6 bg-alemah-cream/30 border border-alemah-sand/40 rounded-3xl p-8 sm:p-10 shadow-lg backdrop-blur-sm">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-ios-green/15 border-2 border-ios-green/30 flex items-center justify-center animate-pulse-slow">
          <CheckCircle className="w-10 h-10 text-ios-green" />
        </div>

        <div>
          <h1 className="font-serif text-3xl font-extrabold text-alemah-espresso">
            Order Confirmed!
          </h1>
          <p className="font-sans text-sm text-alemah-taupe mt-2 leading-relaxed">
            Thank you for shopping with Alemah. Your order has been placed and our team is preparing it with care.
          </p>
        </div>

        {orderId && (
          <div className="w-full bg-background/80 border border-alemah-sand/50 rounded-2xl p-4 text-left flex flex-col gap-1.5">
            <span className="font-sans text-[10px] font-bold text-alemah-taupe uppercase tracking-widest">
              Order Reference
            </span>
            <span className="font-sans text-xs font-semibold text-alemah-espresso font-mono break-all">
              #{orderId}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 w-full text-xs font-sans text-alemah-taupe bg-alemah-red-050/50 border border-alemah-red-100/60 rounded-2xl p-4">
          <Package className="w-5 h-5 text-alemah-red-600 shrink-0" />
          <span>You will receive an email/SMS confirmation with your tracking details shortly.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="flex-1 h-11 border border-alemah-sand text-alemah-espresso font-sans text-xs font-semibold rounded-full flex items-center justify-center hover:bg-alemah-cream/40 transition-colors"
            >
              Track Order
            </Link>
          )}
          <Link
            href="/shop"
            className="flex-1 h-11 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-sm ios-active-scale"
          >
            Continue Shopping
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-alemah-red-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
