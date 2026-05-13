"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAccount = pathname === "/account";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <nav className="navbar-glass" style={{ padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>

          {/* Логотип */}
          <Link href="/" onClick={() => setOpen(false)} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px 6px 8px", borderRadius: "980px",
            border: "1px solid rgba(255,255,255,0.18)",
            borderTopColor: "rgba(255,255,255,0.32)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
            textDecoration: "none", flexShrink: 0,
          }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #2997ff, #0071e3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(41,151,255,0.5)" }}>GC</div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", whiteSpace: "nowrap" }}>General Conclave</span>
          </Link>

          {/* Десктоп меню — центр */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", fontSize: "0.875rem", color: "var(--text-secondary)" }} className="hidden md:flex">
            <Link href="/digital" className="hover:text-white transition-colors">Digital</Link>
            <Link href="/tech" className="hover:text-white transition-colors">Tech</Link>
            <Link href="/about" className="hover:text-white transition-colors">О нас</Link>
            <Link href="/support" className="hover:text-white transition-colors">Поддержка</Link>
          </div>

          {/* Правая часть */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Десктоп кнопки */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: "12px", minWidth: 80, justifyContent: "flex-end" }}>
              {!ready ? null : user ? (
                !isAccount && (
                  <Link href="/account" className="btn-apple-ghost" style={{ fontSize: "0.78rem", padding: "0.45rem 1.1rem", border: "1px solid rgba(255,255,255,0.15)" }}>Кабинет</Link>
                )
              ) : (
                <>
                  <Link href="/auth/login" style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--accent)", textDecoration: "none" }}>Войти</Link>
                  <Link href="/auth/register" className="btn-apple" style={{ fontSize: "0.78rem", padding: "0.45rem 1.1rem" }}>Начать</Link>
                </>
              )}
            </div>

            {/* Бургер */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
              aria-label="Меню"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                cursor: "pointer",
                width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: "var(--text)",
                transition: "background 0.2s",
              }}
            >
              {open ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <line x1="4" y1="17" x2="20" y2="17"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div style={{
          position: "fixed", top: 48, left: 0, right: 0, zIndex: 99,
          background: "rgba(0,0,0,0.95)", backdropFilter: "blur(30px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: "8px",
          animation: "fade-up 0.2s ease both",
        }}>
          {[
            ["/digital", "Digital"],
            ["/tech", "Tech"],
            ["/about", "О нас"],
            ["/support", "Поддержка"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              padding: "14px 16px", borderRadius: "12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "var(--text)", textDecoration: "none",
              fontSize: "1rem", fontWeight: 500,
            }}>
              {label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            {!ready ? null : user ? (
              <Link href="/account" onClick={() => setOpen(false)} className="btn-apple" style={{ flex: 1, textAlign: "center", fontSize: "0.9rem" }}>Личный кабинет</Link>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)} className="btn-apple-ghost" style={{ flex: 1, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.9rem" }}>Войти</Link>
                <Link href="/auth/register" onClick={() => setOpen(false)} className="btn-apple" style={{ flex: 1, textAlign: "center", fontSize: "0.9rem" }}>Начать</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
