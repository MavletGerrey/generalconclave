"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  color: "var(--text)",
  fontSize: "0.95rem",
  outline: "none",
} as React.CSSProperties;

const labelStyle = {
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  display: "block",
  marginBottom: "0.5rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
} as React.CSSProperties;

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
        setEmail(data.user.email || "");
        setName(data.user.user_metadata?.full_name || "");
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("requests").insert({
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message"),
    });

    if (error) {
      setError("Ошибка отправки. Напишите напрямую: General.Conclave.Industries@gmail.com");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <section style={{ position: "relative", overflow: "hidden", padding: "80px 24px 120px" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(41,151,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <p className="apple-tag anim-1" style={{ marginBottom: "1.2rem" }}>Поддержка</p>
          <h1 className="anim-2 gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.05, marginBottom: "1rem" }}>
            Свяжитесь<br />с нами
          </h1>
          <p className="anim-3" style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem" }}>
            Опишите вопрос — менеджер ответит в ближайшее время.
          </p>

          {sent ? (
            <div className="liquid-glass anim-3" style={{ padding: "56px 40px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(48,209,88,0.15)", border: "1px solid rgba(48,209,88,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem" }}>✓</div>
              <h3 style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Заявка отправлена</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="liquid-glass anim-4" style={{ padding: "40px" }}>
              {isLoggedIn && (
                <div style={{ background: "rgba(41,151,255,0.08)", border: "1px solid rgba(41,151,255,0.2)", borderRadius: "10px", padding: "10px 16px", marginBottom: "1.5rem", fontSize: "0.82rem", color: "var(--accent)" }}>
                  Данные заполнены автоматически из вашего профиля
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label style={labelStyle}>Имя</label>
                  <input name="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Иван Иванов" required style={{ ...inputStyle, background: isLoggedIn ? "rgba(41,151,255,0.06)" : "rgba(255,255,255,0.06)" }} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={{ ...inputStyle, background: isLoggedIn ? "rgba(41,151,255,0.06)" : "rgba(255,255,255,0.06)" }} />
                </div>
                <div>
                  <label style={labelStyle}>Тема</label>
                  <select name="subject" style={{ ...inputStyle, background: "rgba(255,255,255,0.06)" }}>
                    <option style={{ background: "#111" }}>Вопрос по продукту</option>
                    <option style={{ background: "#111" }}>Заявка на разработку</option>
                    <option style={{ background: "#111" }}>Проблема с оплатой</option>
                    <option style={{ background: "#111" }}>Другое</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Сообщение</label>
                  <textarea name="message" rows={5} placeholder="Опишите ваш вопрос..." required style={{ ...inputStyle, resize: "none" }} />
                </div>

                {error && (
                  <div style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#ff3b30" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-apple"
                  style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Отправляем..." : "Отправить заявку"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
