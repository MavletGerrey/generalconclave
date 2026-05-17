"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  ticket_id: string;
  sender: string;
  content: string;
  created_at: string;
  metadata?: { type: string; amount?: number; url?: string } | null;
};

type Ticket = {
  id: string;
  service: string;
  status: string;
  created_at: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export default function Chat({ ticket, currentSender }: { ticket: Ticket; currentSender: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("messages").select("*").eq("ticket_id", ticket.id).order("created_at").then(({ data }) => {
      setMessages(data ?? []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    const channel = supabase.channel(`ticket-${ticket.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `ticket_id=eq.${ticket.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [ticket.id]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await createClient().from("messages").insert({ ticket_id: ticket.id, sender: currentSender, content: text.trim() });
    setText("");
    setSending(false);
  }

  async function handleSendInvoice() {
    const amount = parseInt(invoiceAmount);
    if (!amount || amount < 1) return;
    setSendingInvoice(true);

    const orderId = `ticket_${ticket.id}_${Date.now()}`;
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, orderId, description: `Оплата услуги: ${ticket.service}` }),
    });
    const data = await res.json();

    if (data.url) {
      await createClient().from("messages").insert({
        ticket_id: ticket.id,
        sender: "manager",
        content: `Счёт на оплату: ${ticket.service} — ${amount} ₽`,
        metadata: { type: "invoice", amount, url: data.url },
      });
      setInvoiceAmount("");
    }
    setSendingInvoice(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Шапка */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{ticket.service}</p>
          <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 2 }}>от {formatDate(ticket.created_at)}</p>
        </div>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: ticket.status === "open" ? "var(--accent-green)" : ticket.status === "in_progress" ? "var(--accent)" : "var(--text-tertiary)", background: ticket.status === "open" ? "rgba(48,209,88,0.1)" : ticket.status === "in_progress" ? "rgba(41,151,255,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${ticket.status === "open" ? "rgba(48,209,88,0.25)" : ticket.status === "in_progress" ? "rgba(41,151,255,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: "980px", padding: "3px 10px" }}>
          {ticket.status === "open" ? "Открыт" : ticket.status === "in_progress" ? "В работе" : "Закрыт"}
        </span>
      </div>

      {/* Сообщения */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", minHeight: 0 }}>
        {messages.length === 0 && (
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", textAlign: "center", marginTop: "2rem" }}>
            {currentSender === "manager" ? "Клиент ожидает ответа" : "Менеджер скоро ответит"}
          </p>
        )}
        {messages.map((m) => {
          const isOwn = m.sender === currentSender;
          const isInvoice = m.metadata?.type === "invoice";

          if (isInvoice) {
            return (
              <div key={m.id} style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "14px 18px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,159,10,0.1)", border: "1px solid rgba(255,159,10,0.3)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9f0a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Счёт на оплату</p>
                  <p style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 4 }}>{m.metadata?.amount?.toLocaleString()} ₽</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 12 }}>{ticket.service}</p>
                  {currentSender === "client" && (
                    <a href={m.metadata?.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "block", textAlign: "center", padding: "10px 20px", borderRadius: "10px", background: "#ff9f0a", color: "#000", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                      Оплатить →
                    </a>
                  )}
                  <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginTop: 8, textAlign: "right" }}>{formatTime(m.created_at)}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isOwn ? "var(--accent)" : "rgba(255,255,255,0.08)", border: isOwn ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                {!isOwn && <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent-green)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Менеджер</p>}
                <p style={{ fontSize: "0.9rem", lineHeight: 1.5, color: isOwn ? "#fff" : "var(--text)" }}>{m.content}</p>
                <p style={{ fontSize: "0.65rem", color: isOwn ? "rgba(255,255,255,0.6)" : "var(--text-tertiary)", marginTop: 4, textAlign: "right" }}>{formatTime(m.created_at)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Счёт (только для менеджера) */}
      {currentSender === "manager" && ticket.status !== "closed" && (
        <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "8px", alignItems: "center", background: "rgba(255,159,10,0.04)" }}>
          <span style={{ fontSize: "0.72rem", color: "#ff9f0a", fontWeight: 600, flexShrink: 0 }}>₽ Счёт:</span>
          <input value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} placeholder="Сумма" type="number"
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,159,10,0.3)", borderRadius: "8px", padding: "6px 10px", color: "var(--text)", fontSize: "0.85rem", outline: "none" }} />
          <button onClick={handleSendInvoice} disabled={sendingInvoice || !invoiceAmount}
            style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: invoiceAmount ? "#ff9f0a" : "rgba(255,255,255,0.08)", color: invoiceAmount ? "#000" : "var(--text-tertiary)", cursor: invoiceAmount ? "pointer" : "default", fontSize: "0.8rem", fontWeight: 600, flexShrink: 0 }}>
            {sendingInvoice ? "..." : "Отправить"}
          </button>
        </div>
      )}

      {/* Ввод сообщения */}
      {ticket.status !== "closed" ? (
        <form onSubmit={handleSend} style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "10px", alignItems: "center" }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Написать сообщение..."
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "10px 14px", color: "var(--text)", fontSize: "0.9rem", outline: "none" }} />
          <button type="submit" disabled={sending || !text.trim()}
            style={{ width: 40, height: 40, borderRadius: "50%", background: text.trim() ? "var(--accent)" : "rgba(255,255,255,0.08)", border: "none", cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      ) : (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>Чат закрыт</p>
        </div>
      )}
    </div>
  );
}
