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

export default function AccountClient({ user }: { user: User }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.user_metadata?.full_name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
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
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "err", text: "Минимум 8 символов" });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordMsg({ type: "err", text: "Ошибка. Попробуйте переlogиниться и повторить." });
    } else {
      setPasswordMsg({ type: "ok", text: "Пароль изменён" });
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <section style={{ position: "relative", padding: "60px 24px 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(41,151,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>

          {/* Шапка профиля */}
          <div className="anim-1" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #2997ff, #0071e3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", fontWeight: 700, color: "#fff",
              boxShadow: "0 8px 24px rgba(41,151,255,0.35)",
            }}>
              {(username || user.email || "?")[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontWeight: 700, fontSize: "1.4rem", letterSpacing: "-0.03em", marginBottom: "0.2rem" }} className="gradient-text">
                {username || "Мой аккаунт"}
              </h1>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Мои покупки */}
            <div className="liquid-glass anim-2">
              <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="apple-tag" style={{ marginBottom: "0.3rem" }}>История заказов</p>
                <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.02em" }}>Мои покупки</h2>
              </div>
              <div style={{ padding: "40px 28px", textAlign: "center" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Покупок пока нет</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  После оплаты файлы появятся здесь
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/digital" className="btn-apple" style={{ fontSize: "0.82rem" }}>Conclave Digital</Link>
                  <Link href="/tech" className="btn-apple-ghost" style={{ fontSize: "0.82rem", border: "1px solid rgba(255,255,255,0.15)" }}>Conclave Tech</Link>
                </div>
              </div>
            </div>

            {/* Данные профиля */}
            <form onSubmit={handleSaveProfile} className="liquid-glass anim-3" style={{ padding: "28px" }}>
              <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Данные профиля</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={user.email || ""} disabled style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button type="submit" disabled={savingProfile} className="btn-apple-ghost"
                    style={{ cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", opacity: savingProfile ? 0.7 : 1, flexShrink: 0 }}>
                    {savingProfile ? "Сохраняем..." : "Сохранить"}
                  </button>
                  {profileSaved && <span style={{ fontSize: "0.82rem", color: "var(--accent-green)" }}>✓ Сохранено</span>}
                </div>
              </div>
            </form>

            {/* Смена пароля */}
            <form onSubmit={handleChangePassword} className="liquid-glass anim-4" style={{ padding: "28px" }}>
              <h2 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Сменить пароль</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Новый пароль</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 8 символов" style={inputStyle} />
                </div>

                {passwordMsg && (
                  <div style={{
                    background: passwordMsg.type === "ok" ? "rgba(48,209,88,0.1)" : "rgba(255,59,48,0.1)",
                    border: `1px solid ${passwordMsg.type === "ok" ? "rgba(48,209,88,0.3)" : "rgba(255,59,48,0.3)"}`,
                    borderRadius: "10px", padding: "0.75rem 1rem",
                    fontSize: "0.85rem",
                    color: passwordMsg.type === "ok" ? "var(--accent-green)" : "#ff3b30",
                  }}>
                    {passwordMsg.type === "ok" ? "✓ " : ""}{passwordMsg.text}
                  </div>
                )}

                <button type="submit" disabled={savingPassword} className="btn-apple-ghost"
                  style={{ alignSelf: "flex-start", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", opacity: savingPassword ? 0.7 : 1 }}>
                  {savingPassword ? "Меняем..." : "Изменить пароль"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
