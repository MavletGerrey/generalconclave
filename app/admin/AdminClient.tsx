"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Chat from "../components/Chat";
import { createClient } from "@/lib/supabase/client";

type Ticket = {
  id: string; service: string; status: string; created_at: string;
  profiles?: { full_name?: string; email?: string } | null;
};
type Request = {
  id: string; name: string; email: string; subject?: string;
  message: string; status: string; created_at: string;
};
type Product = {
  id: number; title: string; description: string; price: number;
  tag: string; category: string; color: string; count: string;
  unit: string; is_active: boolean; file_path?: string; image_url?: string;
};

const PALETTE = [
  "#2997ff","#0071e3","#30d158","#34c759","#bf5af2","#9b30d9",
  "#ff9f0a","#ff6b00","#ff3b30","#ff2d55","#ac8e68","#636366",
  "#5e5ce6","#64d2ff","#ffd60a","#30b0c7","#e8d5b7","#ffffff",
];

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
  padding: "0.65rem 0.9rem", color: "var(--text)", fontSize: "0.88rem", outline: "none",
} as React.CSSProperties;

const labelStyle = {
  fontSize: "0.63rem", fontWeight: 700, color: "var(--text-tertiary)",
  display: "block", marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase",
} as React.CSSProperties;

export default function AdminClient({ tickets, requests, products: init }: {
  tickets: Ticket[]; requests: Request[]; products: Product[];
}) {
  const [tab, setTab] = useState<"tickets" | "requests" | "products">("tickets");
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [ticketList, setTicketList] = useState<Ticket[]>(tickets);
  const [products, setProducts] = useState<Product[]>(init);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("admin-tickets")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tickets" },
        (payload) => setTicketList(prev => [payload.new as Ticket, ...prev])
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", description: "", price: "",
    tag: "Промты", category: "prompts",
    color: "#2997ff", count: "", unit: "промтов",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function updateTicketStatus(id: string, status: string) {
    await createClient().from("tickets").update({ status }).eq("id", id);
    window.location.reload();
  }
  async function updateRequestStatus(id: string, status: string) {
    await createClient().from("requests").update({ status }).eq("id", id);
    window.location.reload();
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    let file_path: string | null = null;
    let image_url: string | null = null;

    if (productFile) {
      const ext = productFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-files").upload(path, productFile);
      if (!error) file_path = path;
    }
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, imageFile);
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
    }

    const { data, error } = await supabase.from("products").insert({
      title: form.title, description: form.description,
      price: parseInt(form.price), tag: form.tag, category: form.category,
      color: form.color, count: form.count, unit: form.unit,
      is_active: true, file_path, image_url,
    }).select().single();

    if (!error && data) {
      setProducts(p => [...p, data]);
      setForm({ title: "", description: "", price: "", tag: "Промты", category: "prompts", color: "#2997ff", count: "", unit: "промтов" });
      setImageFile(null); setProductFile(null); setImagePreview(null);
    }
    setSaving(false);
  }

  async function toggleProduct(id: number, is_active: boolean) {
    await createClient().from("products").update({ is_active: !is_active }).eq("id", id);
    setProducts(p => p.map(x => x.id === id ? { ...x, is_active: !is_active } : x));
  }
  async function deleteProduct(id: number) {
    if (!confirm("Удалить товар навсегда?")) return;
    await createClient().from("products").delete().eq("id", id);
    setProducts(p => p.filter(x => x.id !== id));
  }
  async function saveEdit(id: number) {
    await createClient().from("products").update(editForm).eq("id", id);
    setProducts(p => p.map(x => x.id === id ? { ...x, ...editForm } : x));
    setEditingId(null); setEditForm({});
  }

  const TAB = (id: typeof tab, label: string, count?: number) => (
    <button onClick={() => { setTab(id); setActiveTicket(null); }}
      style={{ padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, background: tab === id ? "rgba(255,255,255,0.1)" : "transparent", color: tab === id ? "var(--text)" : "var(--text-tertiary)", transition: "all 0.2s" }}>
      {label}{count !== undefined && count > 0 && <span style={{ background: "var(--accent)", borderRadius: "980px", padding: "1px 7px", fontSize: "0.7rem", marginLeft: 4 }}>{count}</span>}
    </button>
  );

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, background: "rgba(255,59,48,0.15)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "980px", padding: "3px 10px", color: "#ff3b30", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>General Conclave</span>
          </div>
          <Link href="/" style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", textDecoration: "none" }}>← На сайт</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, width: "fit-content" }}>
          {TAB("tickets", "Тикеты", ticketList.filter(t => t.status === "open").length)}
          {TAB("requests", "Заявки", requests.filter(r => r.status === "new").length)}
          {TAB("products", `Товары (${products.length})`)}
        </div>

        {/* Тикеты */}
        {tab === "tickets" && (
          <div style={{ display: "grid", gridTemplateColumns: activeTicket ? "320px 1fr" : "1fr", gap: 16 }}>
            <div className="liquid-glass" style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 style={{ fontWeight: 600, fontSize: "0.95rem" }}>Все тикеты ({ticketList.length})</h2>
              </div>
              {ticketList.length === 0 ? <p style={{ padding: "32px 20px", color: "var(--text-tertiary)", fontSize: "0.88rem", textAlign: "center" }}>Тикетов пока нет</p> : (
                <div style={{ display: "flex", flexDirection: "column", maxHeight: 600, overflowY: "auto" }}>
                  {ticketList.map(t => (
                    <button key={t.id} onClick={() => setActiveTicket(t)} style={{ padding: "14px 20px", textAlign: "left", background: activeTicket?.id === t.id ? "rgba(41,151,255,0.1)" : "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>{t.service}</p>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: t.status === "open" ? "var(--accent-green)" : t.status === "in_progress" ? "var(--accent)" : "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {t.status === "open" ? "Новый" : t.status === "in_progress" ? "В работе" : "Закрыт"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{t.profiles?.full_name || t.profiles?.email || "Клиент"} · {new Date(t.created_at).toLocaleDateString("ru-RU")}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {activeTicket && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="liquid-glass" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", flex: 1 }}>Клиент: <strong>{activeTicket.profiles?.full_name || activeTicket.profiles?.email || "Неизвестен"}</strong></p>
                  {activeTicket.status !== "in_progress" && <button onClick={() => updateTicketStatus(activeTicket.id, "in_progress")} className="btn-apple" style={{ border: "none", cursor: "pointer", fontSize: "0.78rem" }}>Взять в работу</button>}
                  {activeTicket.status !== "closed" && <button onClick={() => updateTicketStatus(activeTicket.id, "closed")} className="btn-apple-ghost" style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: "0.78rem" }}>Закрыть тикет</button>}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {requests.length === 0 ? (
              <div className="liquid-glass" style={{ padding: 48, textAlign: "center" }}><p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem" }}>Заявок пока нет</p></div>
            ) : requests.map(r => (
              <div key={r.id} className="liquid-glass" style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{r.name} · <span style={{ color: "var(--accent)", fontWeight: 400 }}>{r.email}</span></p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{r.subject} · {new Date(r.created_at).toLocaleDateString("ru-RU")}</p>
                  </div>
                  {r.status === "new" && <button onClick={() => updateRequestStatus(r.id, "read")} className="btn-apple-ghost" style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: "0.78rem" }}>Прочитано</button>}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px" }}>{r.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Товары */}
        {tab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>

            {/* Список */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {products.length === 0 ? (
                <div className="liquid-glass" style={{ padding: 48, textAlign: "center" }}><p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem" }}>Товаров пока нет</p></div>
              ) : products.map(p => (
                <div key={p.id} className="liquid-glass" style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: p.color + "33", border: `1px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color }} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                        {p.price} ₽ · {p.category === "prompts" ? "Промты" : "Шаблоны"} · {p.file_path ? "📎 файл есть" : "нет файла"}
                      </p>
                    </div>
                    <button onClick={() => { setEditingId(editingId === p.id ? null : p.id); setEditForm({ title: p.title, description: p.description, price: p.price, tag: p.tag }); }}
                      style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "980px", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", flexShrink: 0, background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
                      {editingId === p.id ? "Отмена" : "Изменить"}
                    </button>
                    <button onClick={() => toggleProduct(p.id, p.is_active)} style={{ fontSize: "0.7rem", fontWeight: 700, padding: "4px 12px", borderRadius: "980px", border: "none", cursor: "pointer", flexShrink: 0, background: p.is_active ? "rgba(48,209,88,0.15)" : "rgba(255,159,10,0.15)", color: p.is_active ? "var(--accent-green)" : "#ff9f0a" }}>
                      {p.is_active ? "Активен" : "Пауза"}
                    </button>
                    <button onClick={() => deleteProduct(p.id)} style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "980px", border: "1px solid rgba(255,59,48,0.3)", cursor: "pointer", flexShrink: 0, background: "rgba(255,59,48,0.08)", color: "#ff3b30" }}>
                      Удалить
                    </button>
                  </div>
                  {editingId === p.id && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <input value={editForm.title ?? ""} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} placeholder="Название" style={inputStyle} />
                      <input value={editForm.tag ?? ""} onChange={e => setEditForm(f => ({ ...f, tag: e.target.value }))} placeholder="Тег" style={inputStyle} />
                      <input type="number" value={editForm.price ?? ""} onChange={e => setEditForm(f => ({ ...f, price: parseInt(e.target.value) }))} placeholder="Цена" style={inputStyle} />
                      <textarea value={editForm.description ?? ""} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Описание" style={{ ...inputStyle, gridColumn: "1 / -1", resize: "none" }} />
                      <button onClick={() => saveEdit(p.id)} className="btn-apple" style={{ gridColumn: "1 / -1", border: "none", cursor: "pointer", fontSize: "0.82rem" }}>Сохранить изменения</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Форма */}
            <form onSubmit={addProduct} className="liquid-glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Новый товар</h2>

              {/* Категория */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["prompts", "Промты"], ["templates", "Шаблон сайта"]].map(([val, lbl]) => (
                  <button type="button" key={val} onClick={() => set("category", val)}
                    style={{ padding: "8px", borderRadius: 10, border: `1px solid ${form.category === val ? "rgba(41,151,255,0.5)" : "rgba(255,255,255,0.1)"}`, cursor: "pointer", fontSize: "0.82rem", fontWeight: 500, background: form.category === val ? "rgba(41,151,255,0.12)" : "rgba(255,255,255,0.04)", color: form.category === val ? "var(--accent)" : "var(--text-secondary)" }}>
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Название */}
              <div>
                <label style={labelStyle}>Название</label>
                <input required value={form.title} onChange={e => set("title", e.target.value)} placeholder="Промт-пак для ChatGPT" style={inputStyle} />
              </div>

              {/* Описание */}
              <div>
                <label style={labelStyle}>Описание</label>
                <textarea required value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Что входит в продукт..." style={{ ...inputStyle, resize: "none" }} />
              </div>

              {/* Цена и тег */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={labelStyle}>Цена (₽)</label>
                  <input required type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="490" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Тег</label>
                  <input required value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="Промты" style={inputStyle} />
                </div>
              </div>

              {/* Кол-во и единица */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={labelStyle}>Количество</label>
                  <input value={form.count} onChange={e => set("count", e.target.value)} placeholder="50" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Единица</label>
                  <input value={form.unit} onChange={e => set("unit", e.target.value)} placeholder="промтов" style={inputStyle} />
                </div>
              </div>

              {/* Палитра */}
              <div>
                <label style={labelStyle}>Цвет карточки</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {PALETTE.map(c => (
                    <button type="button" key={c} onClick={() => set("color", c)}
                      style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: form.color === c ? "3px solid white" : "3px solid transparent", cursor: "pointer", boxShadow: form.color === c ? `0 0 0 1px ${c}` : "none", transition: "all 0.15s" }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: form.color, flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }} />
                  <input value={form.color} onChange={e => set("color", e.target.value)} placeholder="#2997ff" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>

              {/* Обложка */}
              <div>
                <label style={labelStyle}>Обложка (картинка)</label>
                <input type="file" accept="image/*" ref={imageRef} style={{ display: "none" }} onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                }} />
                <button type="button" onClick={() => imageRef.current?.click()}
                  style={{ ...inputStyle, cursor: "pointer", textAlign: "left", color: imageFile ? "var(--accent-green)" : "var(--text-tertiary)" }}>
                  {imageFile ? `✓ ${imageFile.name}` : "Выбрать изображение..."}
                </button>
                {imagePreview && <img src={imagePreview} alt="" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, marginTop: 6 }} />}
              </div>

              {/* Файл продукта */}
              <div>
                <label style={labelStyle}>Файл для скачивания</label>
                <input type="file" ref={fileRef} style={{ display: "none" }} onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) setProductFile(f);
                }} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ ...inputStyle, cursor: "pointer", textAlign: "left", color: productFile ? "var(--accent-green)" : "var(--text-tertiary)" }}>
                  {productFile ? `✓ ${productFile.name}` : "Загрузить файл (PDF, ZIP, TXT...)"}
                </button>
              </div>

              <button type="submit" disabled={saving} className="btn-apple" style={{ border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, marginTop: 4, fontSize: "0.9rem" }}>
                {saving ? "Сохраняем..." : "Добавить товар"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
