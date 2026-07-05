"use client";

import { useEffect, useState } from "react";
import { Download, X, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOSBrowser() {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS] = useState(isIOSBrowser);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const viewCount = parseInt(localStorage.getItem("alemah-product-views") || "0", 10);
      const dismissed = localStorage.getItem("alemah-pwa-dismissed") === "true";
      if (viewCount >= 2 && !isStandalone && !dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check views on load
    const checkEngagement = () => {
      const viewCount = parseInt(localStorage.getItem("alemah-product-views") || "0", 10);
      const dismissed = localStorage.getItem("alemah-pwa-dismissed") === "true";
      if (viewCount >= 2 && !isStandalone && !dismissed) {
        setShowPrompt(true);
      }
    };

    checkEngagement();
    // Custom trigger we emit when a product page loads
    window.addEventListener("alemah-product-viewed", checkEngagement);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("alemah-product-viewed", checkEngagement);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("alemah-pwa-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-8 md:bottom-8 md:max-w-sm transition-all duration-300">
      <div className="bg-alemah-cream border border-alemah-sand/60 p-5 rounded-2xl shadow-xl flex flex-col gap-3.5 relative textile-pattern">
        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 text-alemah-taupe hover:text-alemah-espresso p-1 rounded-full hover:bg-alemah-sand/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4 items-center pr-4">
          <div className="w-12 h-12 rounded-xl bg-alemah-red-600 flex items-center justify-center text-white shrink-0 font-serif font-bold text-lg shadow-sm">
            A
          </div>
          <div>
            <h4 className="font-sans font-semibold text-alemah-espresso text-sm leading-tight">
              Add Alemah to Home Screen
            </h4>
            <p className="font-sans text-xs text-alemah-taupe mt-0.5">
              Install the app for offline shopping and instant tracking.
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="text-xs text-alemah-taupe leading-relaxed bg-alemah-ivory/50 p-3 rounded-xl border border-alemah-sand/40 flex flex-col gap-1">
            <p>To install on your iPhone:</p>
            <ol className="list-decimal pl-4 flex flex-col gap-0.5">
              <li>
                Tap the <span className="font-semibold text-alemah-espresso">Share</span> button below
              </li>
              <li>
                Scroll down and tap <span className="font-semibold text-alemah-espresso">&quot;Add to Home Screen&quot;</span>{" "}
                <PlusSquare className="w-3.5 h-3.5 inline ml-0.5 text-alemah-espresso" />
              </li>
            </ol>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="w-full h-11 rounded-full bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold flex items-center justify-center gap-2 ios-active-scale transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Install App
          </button>
        )}
      </div>
    </div>
  );
}
