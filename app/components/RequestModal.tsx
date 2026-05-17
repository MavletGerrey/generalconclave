"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  service?: string;
  onClose: () => void;
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)", borderRadius: "12px",
  padding: "0.8rem 1rem", color: "var(--text)", fontSize: "0.9rem", outline: "none",
} as React.CSSProperties;

const labelStyle = {
  fontSize: "0.68rem", fontWeight: 700, color: "var(--text-tertiary)",
  display: "block", marginBottom: "0.4rem", letterSpacing: "0.08em", textTransform: "uppercase",
} as React.CSSProperties;

export default function RequestModal({ service, onClose }: Props) {
  const [step, setStep] = useState<"choose" | "site" | "done">("choose");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
        setEmail(data.user.email || "");
        setName(data.user.user_metadata?.full_name || "");
      }
    });
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function openTelegram() {
    const serviceSlug = (service || "general").replace(/\s+/g, "_");
    window.open(`https://t.me/generalconclave_bot?start=${serviceSlug}`, "_blank");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: ticket } = await supabase
        .from("tickets")
        .insert({ user_id: user.id, service: service || "Общий вопрос" })
        .select().single();
      if (ticket && message) {
        await supabase.from("messages").insert({ ticket_id: ticket.id, sender: "client", content: message });
        fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "ticket", service: service || "Общий вопрос", message }) });
      }
    } else {
      await supabase.from("requests").insert({ name, email, subject: service || "Заявка", message });
      fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "request", name, email, service: service || "Заявка", message }) });
    }

    setLoading(false);
    setStep("done");
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
      <div onClick={e => e.stopPropagation()} className="liquid-glass" style={{ width: "100%", maxWidth: "480px", padding: "36px", animation: "fade-up 0.25s ease both" }}>

        {/* Шапка */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
              {step === "choose" ? "Как удобнее общаться?" : step === "done" ? "Заявка отправлена" : "Оставить заявку"}
            </h3>
            {service && <p style={{ color: "var(--accent)", fontSize: "0.82rem" }}>{service}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: "1.2rem", padding: "4px" }}>✕</button>
        </div>

        {/* Шаг 1 — выбор канала */}
        {step === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Telegram */}
            <button onClick={openTelegram} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px", borderRadius: "14px", background: "rgba(41,151,255,0.08)", border: "1px solid rgba(41,151,255,0.25)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: "rgba(41,151,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#2997ff">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.062 13.62l-2.97-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.94z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: "3px" }}>Telegram</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Открывает AI-консультанта — отвечает сразу</p>
              </div>
              <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            {/* Сайт */}
            <button onClick={() => setStep("site")} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: "3px" }}>Чат на сайте</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Форма — ответим в личном кабинете</p>
              </div>
              <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}

        {/* Шаг 2 — форма */}
        {step === "site" && (
          <>
            {isLoggedIn && (
              <div style={{ background: "rgba(41,151,255,0.08)", border: "1px solid rgba(41,151,255,0.2)", borderRadius: "10px", padding: "10px 16px", marginBottom: "1.2rem", fontSize: "0.82rem", color: "var(--accent)" }}>
                После отправки откроется чат в личном кабинете
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!isLoggedIn && (
                <>
                  <div>
                    <label style={labelStyle}>Имя</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={inputStyle} />
                  </div>
                </>
              )}
              <div>
                <label style={labelStyle}>Сообщение</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Опишите ваш проект или вопрос..." required style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => setStep("choose")} style={{ padding: "0.75rem 1rem", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "var(--text-secondary)", fontSize: "0.85rem" }}>← Назад</button>
                <button type="submit" disabled={loading} className="btn-apple" style={{ flex: 1, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Отправляем..." : "Отправить"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Шаг 3 — готово */}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(48,209,88,0.15)", border: "1px solid rgba(48,209,88,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", fontSize: "1.5rem" }}>✓</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {isLoggedIn ? "Чат с менеджером открыт в личном кабинете." : "Менеджер свяжется с вами в ближайшее время."}
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {isLoggedIn && (
                <button onClick={() => { onClose(); router.push("/account"); }} className="btn-apple" style={{ border: "none", cursor: "pointer" }}>
                  Открыть чат
                </button>
              )}
              <button onClick={onClose} className="btn-apple-ghost" style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
