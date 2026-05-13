"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar-glass px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-12">

        {/* Логотип */}
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px 6px 8px",
          borderRadius: "980px",
          border: "1px solid rgba(255,255,255,0.18)",
          borderTopColor: "rgba(255,255,255,0.32)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 20px rgba(41,151,255,0.08)",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 28px rgba(41,151,255,0.18)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(41,151,255,0.35)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 20px rgba(41,151,255,0.08)";
          (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
        }}
        >
          {/* Иконка GC */}
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "linear-gradient(135deg, #2997ff, #0071e3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.55rem", fontWeight: 800, color: "#fff",
            letterSpacing: "-0.03em", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(41,151,255,0.5)",
          }}>GC</div>
          <span style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>General Conclave</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
          <Link href="/tech" className="hover:text-white transition-colors">Tech</Link>
          <Link href="/about" className="hover:text-white transition-colors">О нас</Link>
          <Link href="/support" className="hover:text-white transition-colors">Поддержка</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium transition-opacity" style={{ color: "var(--accent)" }}>
            Войти
          </Link>
          <Link href="/auth/register" className="btn-apple" style={{ fontSize: "0.78rem", padding: "0.45rem 1.1rem" }}>
            Начать
          </Link>
        </div>
      </div>
    </nav>
  );
}
