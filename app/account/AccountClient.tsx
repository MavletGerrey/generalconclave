"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chat from "../components/Chat";
import type { User } from "@supabase/supabase-js";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  color: "var(--text)",
  fontSize: "0.95rem",
  outline: "none",
} as React.CSSProperties;

const labelStyle = {
  fontSize: "0.68rem",
  fontWeight: 700,
  color: "var(--text-tertiary)",
  display: "block",
  marginBottom: "0.5rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
} as React.CSSProperties;

type Ticket = { id: string; service: string; status: string; created_at: string };

export default function AccountClient({ user }: { user: User }) {
  const router = useRouter();
  const [tab, setTab] = useState<"orders" | "tickets" | "profile">("orders");
  const [username, setUsername] = useState(user.user_metadata?.full_name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("tickets").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setTickets(data ?? []);
    });
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    await createClient().auth.updateUser({ data: { full_name: username } });
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) { setPasswordMsg({ type: "err", text: "Минимум 8 символов" }); return; }
    setSavingPassword(true);
    setPasswordMsg(null);
    const { error } = await createClient().auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { setPasswordMsg({ type: "err", text: "Ошибка. Попробуйте снова." }); }
    else { setPasswordMsg({ type: "ok", text: "Пароль успешно изменён" }); setNewPassword(""); }
  }

  const initial = (username || user.email || "?")[0].toUpperCase();

  const TAB_BTN = (id: typeof tab, label: string, count?: number) => (
    <button
      onClick={() => { setTab(id); setActiveTicket(null); }}
      style={{ padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, background: tab === id ? "rgba(255,255,255,0.1)" : "transparent", color: tab === id ? "var(--text)" : "var(--text-tertiary)", position: "relative", transition: "all 0.2s" }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
      )}
    </button>
  );

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(41,151,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto", padding: "60px 24px 80px" }}>

          {/* Шапка */}
          <div className="anim-1" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #2997ff, #0058cc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: "0 8px 24px rgba(41,151,255,0.35)", border: "2px solid rgba(255,255,255,0.15)" }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="gradient-text" style={{ fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.04em", marginBottom: "0.2rem" }}>
                {username || "Мой аккаунт"}
              </h1>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>{user.email}</p>
            </div>
            {user.email === "mavletgerreyllc@gmail.com" && (
              <Link href="/admin" style={{ background: "rgba(255,59,48,0.12)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: "10px", padding: "8px 16px", color: "#ff3b30", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>
                Админ
              </Link>
            )}
            <button onClick={async () => { await createClient().auth.signOut(); router.push("/"); router.refresh(); }}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 16px", color: "var(--text-tertiary)", fontSize: "0.82rem", cursor: "pointer" }}>
              Выйти
            </button>
          </div>

          {/* Табы */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
            {TAB_BTN("orders", "Покупки")}
            {TAB_BTN("tickets", "Заявки", tickets.length)}
            {TAB_BTN("profile", "Профиль")}
          </div>

          {/* Покупки */}
          {tab === "orders" && (
            <div className="liquid-glass anim-2" style={{ overflow: "hidden" }}>
              <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.02em" }}>Мои покупки</h2>
                <Link href="/digital" style={{ fontSize: "0.82rem", color: "var(--accent)", textDecoration: "none" }}>Каталог →</Link>
              </div>
              <div style={{ padding: "48px 28px", textAlign: "center" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>Покупок пока нет</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>После оплаты файлы появятся здесь</p>
              </div>
            </div>
          )}

          {/* Заявки / Чат */}
          {tab === "tickets" && (
            <div className="anim-2" style={{ display: "grid", gridTemplateColumns: activeTicket ? "280px 1fr" : "1fr", gap: "16px", minHeight: 500 }}>

              {/* Список тикетов */}
              <div className="liquid-glass" style={{ overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 style={{ fontWeight: 600, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>Мои заявки</h2>
                </div>
                {tickets.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>Заявок пока нет</p>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.78rem", lineHeight: 1.6 }}>
                      Оставьте заявку на услугу — здесь откроется чат с менеджером
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {tickets.map(t => (
                      <button key={t.id} onClick={() => setActiveTicket(t)} style={{ padding: "14px 20px", textAlign: "left", background: activeTicket?.id === t.id ? "rgba(41,151,255,0.1)" : "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "background 0.15s" }}>
                        <p style={{ fontWeight: 500, fontSize: "0.88rem", color: "var(--text)", marginBottom: 4 }}>{t.service}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                            {new Date(t.created_at).toLocaleDateString("ru-RU")}
                          </p>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: t.status === "open" ? "var(--accent-green)" : "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {t.status === "open" ? "Открыт" : t.status === "in_progress" ? "В работе" : "Закрыт"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Чат */}
              {activeTicket && (
                <div className="liquid-glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: 520 }}>
                  <Chat ticket={activeTicket} currentSender="client" />
                </div>
              )}
            </div>
          )}

          {/* Профиль */}
          {tab === "profile" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="anim-2">
              <form onSubmit={handleSaveProfile} className="liquid-glass" style={{ padding: "28px" }}>
                <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>Данные профиля</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={user.email || ""} disabled style={{ ...inputStyle, opacity: 0.35, cursor: "not-allowed" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                    <button type="submit" disabled={savingProfile} className="btn-apple" style={{ border: "none", cursor: savingProfile ? "not-allowed" : "pointer", opacity: savingProfile ? 0.7 : 1, fontSize: "0.82rem" }}>
                      {savingProfile ? "Сохраняем..." : "Сохранить"}
                    </button>
                    {profileSaved && <span style={{ fontSize: "0.82rem", color: "var(--accent-green)" }}>✓ Сохранено</span>}
                  </div>
                </div>
              </form>

              <form onSubmit={handleChangePassword} className="liquid-glass" style={{ padding: "28px" }}>
                <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>Сменить пароль</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Новый пароль</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 8 символов" style={inputStyle} />
                  </div>
                  {passwordMsg && (
                    <div style={{ borderRadius: "10px", padding: "0.7rem 1rem", fontSize: "0.82rem", background: passwordMsg.type === "ok" ? "rgba(48,209,88,0.1)" : "rgba(255,59,48,0.1)", border: `1px solid ${passwordMsg.type === "ok" ? "rgba(48,209,88,0.3)" : "rgba(255,59,48,0.3)"}`, color: passwordMsg.type === "ok" ? "var(--accent-green)" : "#ff3b30" }}>
                      {passwordMsg.type === "ok" ? "✓ " : ""}{passwordMsg.text}
                    </div>
                  )}
                  <button type="submit" disabled={savingPassword} className="btn-apple" style={{ border: "none", cursor: savingPassword ? "not-allowed" : "pointer", opacity: savingPassword ? 0.7 : 1, fontSize: "0.82rem", alignSelf: "flex-start", marginTop: "4px" }}>
                    {savingPassword ? "Меняем..." : "Изменить пароль"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
