import React from "react";

/**
 * Root layout component for Blueprint Engine Frontend Application.
 * Applies foundational HTML structure and global styling metadata.
 */
export const metadata = {
  title: "Blueprint Engine",
  description: "Next.js Frontend for Blueprint Engine Monorepo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
