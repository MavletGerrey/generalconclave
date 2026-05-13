"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar-glass px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-12">

          {/* Логотип */}
          <Link href="/" onClick={() => setOpen(false)} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px 6px 8px", borderRadius: "980px",
            border: "1px solid rgba(255,255,255,0.18)",
            borderTopColor: "rgba(255,255,255,0.32)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 20px rgba(41,151,255,0.08)",
            textDecoration: "none", transition: "all 0.2s ease",
          }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #2997ff, #0071e3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(41,151,255,0.5)" }}>GC</div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>General Conclave</span>
          </Link>

          {/* Десктоп меню */}
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-secondary)" }}>
            <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
            <Link href="/tech" className="hover:text-white transition-colors">Tech</Link>
            <Link href="/about" className="hover:text-white transition-colors">О нас</Link>
            <Link href="/support" className="hover:text-white transition-colors">Поддержка</Link>
          </div>

          {/* Десктоп кнопки */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium transition-opacity" style={{ color: "var(--accent)" }}>Войти</Link>
            <Link href="/auth/register" className="btn-apple" style={{ fontSize: "0.78rem", padding: "0.45rem 1.1rem" }}>Начать</Link>
          </div>

          {/* Бургер (мобильный) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "var(--text)", display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: "currentColor", borderRadius: 2, transition: "all 0.25s", transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "currentColor", borderRadius: 2, transition: "all 0.25s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "currentColor", borderRadius: 2, transition: "all 0.25s", transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div style={{
          position: "fixed", top: 48, left: 0, right: 0, zIndex: 99,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(30px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "24px",
          display: "flex", flexDirection: "column", gap: "8px",
          animation: "fade-up 0.2s ease both",
        }}>
          {[
            ["/digital", "Digital"],
            ["/tech", "Tech"],
            ["/about", "О нас"],
            ["/support", "Поддержка"],
            ["/account", "Личный кабинет"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              padding: "14px 16px", borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "var(--text)", textDecoration: "none",
              fontSize: "1rem", fontWeight: 500,
              transition: "background 0.15s",
            }}>
              {label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <Link href="/auth/login" onClick={() => setOpen(false)} className="btn-apple-ghost" style={{ flex: 1, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.9rem" }}>Войти</Link>
            <Link href="/auth/register" onClick={() => setOpen(false)} className="btn-apple" style={{ flex: 1, textAlign: "center", fontSize: "0.9rem" }}>Начать</Link>
          </div>
        </div>
      )}
    </>
  );
}
