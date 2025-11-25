import React from "react";
import KargerPage from "./pages/KargerPage";

const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e5e7eb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #1f2937",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Randomized Algorithms Playground
        </h1>
        <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>
          Karger min-cut vizualizáció (v1)
        </span>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <KargerPage />
      </main>
    </div>
  );
};

export default App;
