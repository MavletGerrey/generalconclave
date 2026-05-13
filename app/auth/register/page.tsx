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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) { setError("Примите соглашение и лицензию"); return; }
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const name = form.get("name") as string;

    if (password.length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      setError(error.message === "User already registered" ? "Этот email уже зарегистрирован" : error.message);
      setLoading(false);
      return;
    }

    // Если сессия сразу создана — подтверждение не требуется
    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    // Email подтверждение включено — показываем сообщение
    setError("__confirm__");
    setLoading(false);
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
      <div style={{ position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "600px", background: "radial-gradient(ellipse, rgba(191,90,242,0.1) 0%, transparent 65%)", animation: "pulse-glow 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "15%", right: "10%", width: "350px", height: "350px", background: "radial-gradient(ellipse, rgba(41,151,255,0.08) 0%, transparent 65%)", animation: "float-slow 10s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Link href="/" style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", display: "inline-block", marginBottom: "2rem" }}>
              ← General Conclave
            </Link>
            <h1 className="gradient-text anim-1" style={{ fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-0.05em", display: "block" }}>
              Создать аккаунт
            </h1>
            <p className="anim-2" style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.5rem" }}>Это займёт меньше минуты</p>
          </div>

          <form onSubmit={handleSubmit} className="liquid-glass anim-3" style={{ padding: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {[
                { label: "Имя", name: "name", type: "text", placeholder: "Ваше имя" },
                { label: "Email", name: "email", type: "email", placeholder: "your@email.com" },
                { label: "Пароль", name: "password", type: "password", placeholder: "Минимум 8 символов" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.label}</label>
                  <input name={f.name} type={f.type} placeholder={f.placeholder} required style={inputStyle} />
                </div>
              ))}

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: "3px", accentColor: "var(--accent)", width: 15, height: 15, flexShrink: 0 }}
                />
                <label htmlFor="agree" style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", lineHeight: 1.5, cursor: "pointer" }}>
                  Принимаю{" "}
                  <Link href="/legal/terms" style={{ color: "var(--accent)" }} target="_blank">соглашение</Link>{" "}и{" "}
                  <Link href="/legal/license" style={{ color: "var(--accent)" }} target="_blank">лицензию</Link>
                </label>
              </div>

              {error && error !== "__confirm__" && (
                <div style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#ff3b30" }}>
                  {error}
                </div>
              )}

              {error === "__confirm__" ? (
                <div style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.3)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "var(--accent-green)", textAlign: "center" }}>
                  ✓ Аккаунт создан! Проверьте почту и подтвердите email, затем войдите.
                </div>
              ) : (
                <button type="submit" disabled={loading} className="btn-apple" style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "0.25rem" }}>
                  {loading ? "Создаём аккаунт..." : "Создать аккаунт"}
                </button>
              )}
            </div>

            <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-tertiary)", fontSize: "0.85rem" }}>
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" style={{ color: "var(--accent)" }}>Войти</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
