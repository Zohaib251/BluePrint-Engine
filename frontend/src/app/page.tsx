import React from "react";

/**
 * Main Landing Page Component for Blueprint Engine.
 * Serves as the primary web application dashboard entrypoint.
 */
export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <main
      style={{
        padding: "3rem",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: "1.6",
      }}
    >
      <h1>Blueprint Engine Monorepo</h1>
      <p>
        Next.js Frontend configured to communicate with FastAPI Backend at:
        <code>{apiUrl}</code>
      </p>
    </main>
  );
}
