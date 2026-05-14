"use client";

import { useState } from "react";
import Link from "next/link";
import Chat from "../components/Chat";
import { createClient } from "@/lib/supabase/client";

type Ticket = {
  id: string;
  service: string;
  status: string;
  created_at: string;
  profiles?: { full_name?: string; email?: string } | null;
};

type Request = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminClient({ tickets, requests }: { tickets: Ticket[]; requests: Request[] }) {
  const [tab, setTab] = useState<"tickets" | "requests">("tickets");
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  async function updateTicketStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("tickets").update({ status }).eq("id", id);
    window.location.reload();
  }

  async function updateRequestStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("requests").update({ status }).eq("id", id);
    window.location.reload();
  }

  const TAB_BTN = (id: typeof tab, label: string, count: number) => (
    <button
      onClick={() => { setTab(id); setActiveTicket(null); }}
      style={{ padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, background: tab === id ? "rgba(255,255,255,0.1)" : "transparent", color: tab === id ? "var(--text)" : "var(--text-tertiary)", transition: "all 0.2s" }}
    >
      {label} {count > 0 && <span style={{ background: "var(--accent)", borderRadius: "980px", padding: "1px 7px", fontSize: "0.7rem", marginLeft: 4 }}>{count}</span>}
    </button>
  );

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Шапка */}
      <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, background: "rgba(255,59,48,0.15)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "980px", padding: "3px 10px", color: "#ff3b30", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>General Conclave</span>
          </div>
          <Link href="/" style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", textDecoration: "none" }}>← На сайт</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Табы */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
          {TAB_BTN("tickets", "Тикеты", tickets.filter(t => t.status === "open").length)}
          {TAB_BTN("requests", "Заявки без аккаунта", requests.filter(r => r.status === "new").length)}
        </div>

        {/* Тикеты */}
        {tab === "tickets" && (
          <div style={{ display: "grid", gridTemplateColumns: activeTicket ? "320px 1fr" : "1fr", gap: "16px" }}>

            <div className="liquid-glass" style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 style={{ fontWeight: 600, fontSize: "0.95rem" }}>Все тикеты ({tickets.length})</h2>
              </div>
              {tickets.length === 0 ? (
                <p style={{ padding: "32px 20px", color: "var(--text-tertiary)", fontSize: "0.88rem", textAlign: "center" }}>Тикетов пока нет</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", maxHeight: 600, overflowY: "auto" }}>
                  {tickets.map(t => (
                    <button key={t.id} onClick={() => setActiveTicket(t)} style={{ padding: "14px 20px", textAlign: "left", background: activeTicket?.id === t.id ? "rgba(41,151,255,0.1)" : "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>{t.service}</p>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: t.status === "open" ? "var(--accent-green)" : t.status === "in_progress" ? "var(--accent)" : "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                          {t.status === "open" ? "Новый" : t.status === "in_progress" ? "В работе" : "Закрыт"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                        {t.profiles?.full_name || t.profiles?.email || "Клиент"} · {new Date(t.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeTicket && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Управление тикетом */}
                <div className="liquid-glass" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1 }}>
                    Клиент: <strong>{activeTicket.profiles?.full_name || activeTicket.profiles?.email || "Неизвестен"}</strong>
                  </p>
                  {activeTicket.status !== "in_progress" && (
                    <button onClick={() => updateTicketStatus(activeTicket.id, "in_progress")} className="btn-apple" style={{ border: "none", cursor: "pointer", fontSize: "0.78rem" }}>Взять в работу</button>
                  )}
                  {activeTicket.status !== "closed" && (
                    <button onClick={() => updateTicketStatus(activeTicket.id, "closed")} className="btn-apple-ghost" style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: "0.78rem" }}>Закрыть тикет</button>
                  )}
                </div>
                {/* Чат */}
                <div className="liquid-glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: 520 }}>
                  <Chat ticket={activeTicket} currentSender="manager" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Заявки без аккаунта */}
        {tab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {requests.length === 0 ? (
              <div className="liquid-glass" style={{ padding: "48px", textAlign: "center" }}>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem" }}>Заявок пока нет</p>
              </div>
            ) : requests.map(r => (
              <div key={r.id} className="liquid-glass" style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{r.name} · <span style={{ color: "var(--accent)", fontWeight: 400 }}>{r.email}</span></p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{r.subject} · {new Date(r.created_at).toLocaleDateString("ru-RU")}</p>
                  </div>
                  {r.status === "new" && (
                    <button onClick={() => updateRequestStatus(r.id, "read")} className="btn-apple-ghost" style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: "0.78rem" }}>Отметить прочитанным</button>
                  )}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px 16px" }}>{r.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
