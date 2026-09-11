"use client";

import React, { useState, useEffect } from "react";

/**
 * CookieConsent component.
 * Displays an interactive cookie consent banner with localStorage persistence.
 */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already accepted or declined cookies
    const consent = localStorage.getItem("cookie_consent_choice");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent_choice", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent_choice", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 right-4 max-w-md w-full bg-card/95 backdrop-blur-xl border border-border rounded-xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Cookie & Privacy Preferences
          </h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We use essential cookies to ensure system functionality and analyze general system performance. By clicking &quot;Accept All&quot;, you agree to our privacy policy.
        </p>
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 py-2 px-4 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border"
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
