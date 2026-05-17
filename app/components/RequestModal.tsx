"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  service?: string;
  onClose: () => void;
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "0.8rem 1rem",
  color: "var(--text)",
  fontSize: "0.9rem",
  outline: "none",
} as React.CSSProperties;

const labelStyle = {
  fontSize: "0.68rem",
  fontWeight: 700,
  color: "var(--text-tertiary)",
  display: "block",
  marginBottom: "0.4rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
} as React.CSSProperties;

export default function RequestModal({ service, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Залогинен — создаём тикет с первым сообщением
      const { data: ticket } = await supabase
        .from("tickets")
        .insert({ user_id: user.id, service: service || "Общий вопрос" })
        .select()
        .single();

      if (ticket) {
        await supabase.from("messages").insert({
          ticket_id: ticket.id,
          sender: "client",
          content: message,
        });
        fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "ticket", service: service || "Общий вопрос", message }) });
      }
    } else {
      // Не залогинен — сохраняем в requests
      await supabase.from("requests").insert({ name, email, subject: service || "Заявка", message });
      fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "request", name, email, service: service || "Заявка", message }) });
    }

    setLoading(false);
    setDone(true);
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
      <div onClick={e => e.stopPropagation()} className="liquid-glass" style={{ width: "100%", maxWidth: "480px", padding: "40px", animation: "fade-up 0.25s ease both" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(48,209,88,0.15)", border: "1px solid rgba(48,209,88,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", fontSize: "1.5rem" }}>✓</div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Заявка отправлена</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {isLoggedIn
                ? "Чат с менеджером открыт в вашем личном кабинете."
                : "Менеджер свяжется с вами в ближайшее время."}
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {isLoggedIn && (
                <button onClick={() => { onClose(); router.push("/account"); }} className="btn-apple" style={{ border: "none", cursor: "pointer" }}>
                  Открыть чат
                </button>
              )}
              <button onClick={onClose} className="btn-apple-ghost" style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
                Закрыть
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>Оставить заявку</h3>
                {service && <p style={{ color: "var(--accent)", fontSize: "0.82rem" }}>{service}</p>}
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: "1.2rem", lineHeight: 1, padding: "4px" }}>✕</button>
            </div>

            {isLoggedIn && (
              <div style={{ background: "rgba(41,151,255,0.08)", border: "1px solid rgba(41,151,255,0.2)", borderRadius: "10px", padding: "10px 16px", marginBottom: "1.2rem", fontSize: "0.82rem", color: "var(--accent)" }}>
                После отправки откроется чат с менеджером в личном кабинете
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
              <button type="submit" disabled={loading} className="btn-apple" style={{ border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "4px" }}>
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
