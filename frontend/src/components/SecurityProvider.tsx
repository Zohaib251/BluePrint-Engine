"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ShieldAlert } from "lucide-react";

/**
 * Enhanced HTML input attributes providing anti-tamper and anti-inspection protection.
 * Prevents context menu right-clicking, dragging, browser autofill scraping, and spellcheck sniffing.
 */
export const secureInputProps = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "none",
  spellCheck: false,
  "data-lpignore": "true",
  "data-form-type": "other",
  onContextMenu: (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  },
  onDragStart: (e: React.DragEvent) => e.preventDefault(),
  onDrop: (e: React.DragEvent) => e.preventDefault(),
};

/**
 * SecurityProvider Component.
 * Intercepts DevTools shortcuts (F12, Ctrl+Shift+I/J/C/K/E, Ctrl+U, Ctrl+S),
 * disables right-click context menu ("Inspect Element" blocking) in capture phase,
 * and monitors for active DevTools inspection.
 */
export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const triggerWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    // Blur any active input to prevent memory/DOM scraping while inspecting
    if (
      document.activeElement &&
      (document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.tagName === "SELECT")
    ) {
      (document.activeElement as HTMLElement).blur();
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (warningMessage) {
      timeoutId = setTimeout(() => {
        setWarningMessage(null);
      }, 3200);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [warningMessage]);

  useEffect(() => {
    // 1. Block Context Menu (Disables "Inspect Element" right-click everywhere, especially inputs)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerWarning("Right-click and 'Inspect Element' are disabled for security.");
      return false;
    };

    // 2. Block Developer Tools & Source Inspection Keyboard Shortcuts (Windows, Linux, macOS)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isAltOrOpt = e.altKey;
      const key = e.key ? e.key.toUpperCase() : "";

      // F12 or Shift+F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning("Developer Tools access (F12) is locked.");
        return false;
      }

      // Ctrl+Shift+I / Cmd+Opt+I (DevTools Inspect)
      // Ctrl+Shift+J / Cmd+Opt+J (DevTools Console)
      // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element Selector)
      // Ctrl+Shift+K / Cmd+Opt+K (Firefox Web Console)
      // Ctrl+Shift+E / Cmd+Opt+E (Network Inspector)
      const isDevToolsShortcut =
        (isCmdOrCtrl && e.shiftKey && ["I", "J", "C", "K", "E"].includes(key)) ||
        (isCmdOrCtrl && isAltOrOpt && ["I", "J", "C", "K", "E"].includes(key));

      if (isDevToolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning("Inspect element and DevTools shortcuts are blocked.");
        return false;
      }

      // Ctrl+U / Cmd+U / Cmd+Opt+U (View Page Source)
      if (isCmdOrCtrl && key === "U") {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning("Viewing page source is disabled.");
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (isCmdOrCtrl && key === "S") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. DevTools Open Detection via Dimension Delta Check
    const checkDevToolsOpen = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        // Docked DevTools detected
        triggerWarning("Developer Tools inspection detected. Input fields locked.");
      }
    };

    // Attach high-priority capture-phase listeners on both document and window
    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("resize", checkDevToolsOpen);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("resize", checkDevToolsOpen);
    };
  }, [triggerWarning]);

  return (
    <>
      {/* Security alert toast */}
      {warningMessage && (
        <div
          role="alert"
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-rose-950/95 text-rose-200 border border-rose-800/90 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}
      {children}
    </>
  );
}
