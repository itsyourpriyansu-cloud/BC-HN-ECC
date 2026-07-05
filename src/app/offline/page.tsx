"use client";

import Link from "next/link";
import { WifiOff, RotateCw } from "lucide-react";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen textile-pattern bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-alemah-cream/30 border border-alemah-sand/40 backdrop-blur-md flex flex-col items-center shadow-lg">
        {/* iOS-style Soft Alert Circle */}
        <div className="w-16 h-16 rounded-full bg-alemah-red-100 flex items-center justify-center text-alemah-red-600 mb-6 animate-pulse">
          <WifiOff className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl font-semibold text-alemah-espresso mb-3">
          Connection Lost
        </h1>
        
        <p className="font-sans text-alemah-taupe text-base leading-relaxed mb-8">
          It seems you are currently offline. Alemah&apos;s collection will be waiting for you as soon as you reconnect.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleRetry}
            className="w-full h-12 rounded-full bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans font-medium flex items-center justify-center gap-2 ios-active-scale transition-colors shadow-sm"
          >
            <RotateCw className="w-4 h-4" />
            Try Reconnecting
          </button>
          
          <Link
            href="/"
            className="w-full h-12 rounded-full border border-alemah-sand hover:bg-alemah-cream/50 text-alemah-espresso font-sans font-medium flex items-center justify-center ios-active-scale transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mt-8 font-sans text-xs text-alemah-taupe/70">
        &copy; {new Date().getFullYear()} Alemah. Woven with Care.
      </div>
    </div>
  );
}
