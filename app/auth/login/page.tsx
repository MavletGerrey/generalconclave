"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  color: "#f5f5f7",
  fontSize: "0.95rem",
  outline: "none",
} as React.CSSProperties;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Неверный email или пароль");
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "600px", background: "radial-gradient(ellipse, rgba(41,151,255,0.12) 0%, transparent 65%)", animation: "pulse-glow 7s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(48,209,88,0.07) 0%, transparent 65%)", animation: "float-slow 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Link href="/" style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", display: "inline-block", marginBottom: "2rem" }}>
              ← General Conclave
            </Link>
            <h1 className="gradient-text anim-1" style={{ fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-0.05em", display: "block" }}>
              Добро пожаловать
            </h1>
            <p className="anim-2" style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.5rem" }}>Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleSubmit} className="liquid-glass anim-3" style={{ padding: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Email</label>
                <input name="email" type="email" placeholder="your@email.com" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Пароль</label>
                <input name="password" type="password" placeholder="••••••••" required style={inputStyle} />
              </div>

              {error && (
                <div style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#ff3b30" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-apple" style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "0.5rem" }}>
                {loading ? "Входим..." : "Войти"}
              </button>
            </div>

            <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-tertiary)", fontSize: "0.85rem" }}>
              Нет аккаунта?{" "}
              <Link href="/auth/register" style={{ color: "var(--accent)" }}>Зарегистрироваться</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
