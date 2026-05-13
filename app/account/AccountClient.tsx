"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

export default function AccountClient({ user }: { user: User }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.user_metadata?.full_name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: username } });
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) { setPasswordMsg({ type: "err", text: "Минимум 8 символов" }); return; }
    setSavingPassword(true);
    setPasswordMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordMsg({ type: "err", text: "Ошибка. Попробуйте снова." });
    } else {
      setPasswordMsg({ type: "ok", text: "Пароль успешно изменён" });
      setNewPassword("");
    }
  }

  const initial = (username || user.email || "?")[0].toUpperCase();

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* Орбы */}
      <div style={{ position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "600px", background: "radial-gradient(ellipse, rgba(41,151,255,0.08) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(48,209,88,0.05) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Шапка */}
        <div className="anim-1" style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px", paddingBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #2997ff 0%, #0058cc 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", fontWeight: 700, color: "#fff",
            boxShadow: "0 8px 32px rgba(41,151,255,0.4)",
            border: "2px solid rgba(255,255,255,0.15)",
          }}>
            {initial}
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "1.6rem", letterSpacing: "-0.04em", marginBottom: "4px" }} className="gradient-text">
              {username || "Мой аккаунт"}
            </h1>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>{user.email}</p>
          </div>
        </div>

        {/* Сетка */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Мои покупки — во всю ширину */}
          <div className="liquid-glass anim-2" style={{ gridColumn: "1 / -1", overflow: "hidden" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="apple-tag" style={{ marginBottom: "4px" }}>История заказов</p>
                <h2 style={{ fontWeight: 600, fontSize: "1.05rem", letterSpacing: "-0.03em" }}>Мои покупки</h2>
              </div>
              <Link href="/digital" style={{ fontSize: "0.82rem", color: "var(--accent)", textDecoration: "none" }}>Перейти в каталог →</Link>
            </div>
            <div style={{ padding: "48px 32px", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>Покупок пока нет</p>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                После оплаты файлы появятся здесь — доступны для скачивания в любое время
              </p>
            </div>
          </div>

          {/* Данные профиля */}
          <form onSubmit={handleSaveProfile} className="liquid-glass anim-3" style={{ padding: "28px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.03em", marginBottom: "20px" }}>Данные профиля</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={user.email || ""} disabled style={{ ...inputStyle, opacity: 0.35, cursor: "not-allowed" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <button type="submit" disabled={savingProfile} className="btn-apple"
                  style={{ border: "none", cursor: savingProfile ? "not-allowed" : "pointer", opacity: savingProfile ? 0.7 : 1, fontSize: "0.82rem" }}>
                  {savingProfile ? "Сохраняем..." : "Сохранить"}
                </button>
                {profileSaved && <span style={{ fontSize: "0.82rem", color: "var(--accent-green)" }}>✓ Сохранено</span>}
              </div>
            </div>
          </form>

          {/* Смена пароля */}
          <form onSubmit={handleChangePassword} className="liquid-glass anim-4" style={{ padding: "28px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.03em", marginBottom: "20px" }}>Сменить пароль</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Новый пароль</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 8 символов" style={inputStyle} />
              </div>

              {passwordMsg && (
                <div style={{
                  borderRadius: "10px", padding: "0.7rem 1rem", fontSize: "0.82rem",
                  background: passwordMsg.type === "ok" ? "rgba(48,209,88,0.1)" : "rgba(255,59,48,0.1)",
                  border: `1px solid ${passwordMsg.type === "ok" ? "rgba(48,209,88,0.3)" : "rgba(255,59,48,0.3)"}`,
                  color: passwordMsg.type === "ok" ? "var(--accent-green)" : "#ff3b30",
                }}>
                  {passwordMsg.type === "ok" ? "✓ " : ""}{passwordMsg.text}
                </div>
              )}

              <button type="submit" disabled={savingPassword} className="btn-apple"
                style={{ border: "none", cursor: savingPassword ? "not-allowed" : "pointer", opacity: savingPassword ? 0.7 : 1, fontSize: "0.82rem", alignSelf: "flex-start", marginTop: "4px" }}>
                {savingPassword ? "Меняем..." : "Изменить пароль"}
              </button>
            </div>
          </form>

        </div>
      </div>

      <Footer />
    </main>
  );
}
