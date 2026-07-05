import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center textile-pattern bg-background">
      <div className="max-w-md flex flex-col items-center gap-6">
        <div className="font-serif text-[120px] sm:text-[160px] font-extrabold text-alemah-red-600/15 leading-none select-none">
          404
        </div>
        <div className="-mt-8">
          <h1 className="font-serif text-3xl font-extrabold text-alemah-espresso">Page Not Found</h1>
          <p className="font-sans text-sm text-alemah-taupe mt-2 max-w-xs mx-auto leading-relaxed">
            This page seems to have gone missing from our textile collection. Let&apos;s get you back to something beautiful.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-2">
          <Link
            href="/"
            className="flex-1 h-11 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 shadow-sm ios-active-scale transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="flex-1 h-11 border border-alemah-sand text-alemah-espresso font-sans text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 hover:bg-alemah-cream/40 transition-colors"
          >
            Browse Shop
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
