import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// Configure Poppins font from Google Fonts with variable support
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Production SEO Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: "Blueprint Engine | Automated Software Architecture & PRD Generator",
    template: "%s | Blueprint Engine",
  },
  description:
    "AI-powered software architecture, database schema, and PRD document generation platform built for modern engineering teams.",
  keywords: [
    "Blueprint Engine",
    "Software Architecture",
    "PRD Generator",
    "Database Schemas",
    "Mermaid.js Diagrams",
    "AI System Design",
  ],
  authors: [{ name: "Blueprint Engine Team" }],
  openGraph: {
    title: "Blueprint Engine | Automated PRD & Architecture Blueprint Generator",
    description:
      "Generate comprehensive Product Requirement Documents, DB Schemas, and Mermaid Diagrams in seconds.",
    url: "https://blueprintengine.dev",
    siteName: "Blueprint Engine",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blueprint Engine",
    description: "Automated Software Architecture & PRD Generator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        {/* Placeholder Google Analytics Script Integration */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PLACEHOLDER', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="bg-gray-950 text-gray-100 font-poppins min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
          <CookieConsent />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
