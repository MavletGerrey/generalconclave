"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 20px 0 14px",
        height: 44,
        borderRadius: "980px",
        border: "1px solid rgba(255,255,255,0.18)",
        borderTopColor: "rgba(255,255,255,0.32)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.2)",
        cursor: "pointer",
        color: "#f5f5f7",
        fontSize: "0.8rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
        fontFamily: "inherit",
        transition: "opacity 0.35s ease, transform 0.35s ease, box-shadow 0.25s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
        pointerEvents: visible ? "auto" : "none",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.55), 0 0 20px rgba(41,151,255,0.2), inset 0 1px 0 rgba(255,255,255,0.25)";
        el.style.borderColor = "rgba(41,151,255,0.4)";
        el.style.transform = "translateY(-3px) scale(1.04)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.2)";
        el.style.borderColor = "rgba(255,255,255,0.18)";
        el.style.transform = "translateY(0) scale(1)";
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
      Наверх
    </button>
  );
}
