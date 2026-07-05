"use client";

import React, { useEffect } from "react";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered successfully with scope:", registration.scope);
            
            // Push Notification Permission Scaffolding
            if ("Notification" in window) {
              if (Notification.permission === "default") {
                // Request permission after 10s delay to prevent annoying popups immediately
                setTimeout(() => {
                  Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                      console.log("Notification permission granted.");
                    }
                  });
                }, 10000);
              }
            }
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return <>{children}</>;
}
