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

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  tag: string;
  category: string;
  color: string;
  count: string;
  unit: string;
  is_active: boolean;
};

const COLORS = [
  { label: "Синий", value: "#2997ff" },
  { label: "Зелёный", value: "#30d158" },
  { label: "Фиолетовый", value: "#bf5af2" },
  { label: "Оранжевый", value: "#ff9f0a" },
  { label: "Красный", value: "#ff3b30" },
];

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "10px", padding: "0.7rem 1rem", color: "var(--text)", fontSize: "0.88rem", outline: "none",
} as React.CSSProperties;

const labelStyle = {
  fontSize: "0.65rem", fontWeight: 700, color: "var(--text-tertiary)", display: "block",
  marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase",
} as React.CSSProperties;

export default function AdminClient({ tickets, requests, products: initialProducts }: {
  tickets: Ticket[];
  requests: Request[];
  products: Product[];
}) {
  const [tab, setTab] = useState<"tickets" | "requests" | "products">("tickets");
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price: "", tag: "Промты",
    category: "prompts", color: "#2997ff", count: "", unit: "промтов",
  });

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

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("products").insert({
      title: form.title,
      description: form.description,
      price: parseInt(form.price),
      tag: form.tag,
      category: form.category,
      color: form.color,
      count: form.count,
      unit: form.unit,
      is_active: true,
    }).select().single();
    if (!error && data) {
      setProducts(prev => [...prev, data]);
      setForm({ title: "", description: "", price: "", tag: "Промты", category: "prompts", color: "#2997ff", count: "", unit: "промтов" });
    }
    setSaving(false);
  }

  async function toggleProduct(id: number, is_active: boolean) {
    const supabase = createClient();
    await supabase.from("products").update({ is_active: !is_active }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !is_active } : p));
  }

  async function deleteProduct(id: number) {
    if (!confirm("Удалить товар?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  const TAB_BTN = (id: typeof tab, label: string, count?: number) => (
    <button
      onClick={() => { setTab(id); setActiveTicket(null); }}
      style={{ padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, background: tab === id ? "rgba(255,255,255,0.1)" : "transparent", color: tab === id ? "var(--text)" : "var(--text-tertiary)", transition: "all 0.2s" }}
    >
      {label} {count !== undefined && count > 0 && <span style={{ background: "var(--accent)", borderRadius: "980px", padding: "1px 7px", fontSize: "0.7rem", marginLeft: 4 }}>{count}</span>}
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
          {TAB_BTN("requests", "Заявки", requests.filter(r => r.status === "new").length)}
          {TAB_BTN("products", "Товары")}
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
                <div className="liquid-glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: 520 }}>
                  <Chat ticket={activeTicket} currentSender="manager" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Заявки */}
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

        {/* Товары */}
        {tab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>

            {/* Список товаров */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h2 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.5rem" }}>Все товары ({products.length})</h2>
              {products.length === 0 ? (
                <div className="liquid-glass" style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem" }}>Товаров пока нет — добавь первый</p>
                </div>
              ) : products.map(p => (
                <div key={p.id} className="liquid-glass" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{p.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                      {p.price} ₽ · {p.tag} · {p.category === "prompts" ? "Промты" : "Шаблоны сайтов"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleProduct(p.id, p.is_active)}
                    style={{ fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: "980px", border: "none", cursor: "pointer", background: p.is_active ? "rgba(48,209,88,0.15)" : "rgba(255,255,255,0.08)", color: p.is_active ? "var(--accent-green)" : "var(--text-tertiary)" }}
                  >
                    {p.is_active ? "Активен" : "Скрыт"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "980px", border: "1px solid rgba(255,59,48,0.3)", cursor: "pointer", background: "rgba(255,59,48,0.1)", color: "#ff3b30" }}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            {/* Форма добавления */}
            <form onSubmit={addProduct} className="liquid-glass" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "20px" }}>
              <h2 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Добавить товар</h2>

              <div>
                <label style={labelStyle}>Категория</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                  <option value="prompts">Промты</option>
                  <option value="templates">Шаблоны сайтов</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Название</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Промт-пак для ChatGPT" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Описание</label>
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Что входит в продукт..." style={{ ...inputStyle, resize: "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Цена (₽)</label>
                  <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="490" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Тег</label>
                  <input required value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Промты" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Количество</label>
                  <input value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))} placeholder="50" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Единица</label>
                  <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="промтов" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Цвет карточки</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {COLORS.map(c => (
                    <button type="button" key={c.value} onClick={() => setForm(f => ({ ...f, color: c.value }))}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: c.value, border: form.color === c.value ? "3px solid white" : "3px solid transparent", cursor: "pointer", flexShrink: 0 }}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-apple" style={{ border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, marginTop: "4px" }}>
                {saving ? "Сохраняем..." : "Добавить товар"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
