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

const StarIcon = ({ filled, onClick }: { filled: boolean; onClick?: () => void }) => (
  <svg onClick={onClick} width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? "#ff9f0a" : "none"} stroke="#ff9f0a" strokeWidth="2"
    style={{ cursor: onClick ? "pointer" : "default", transition: "transform 0.1s" }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function ReviewModal({ productTitle, onClose, onSubmit }: { productTitle: string; onClose: () => void; onSubmit: (rating: number, text: string) => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="liquid-glass" style={{ width: "100%", maxWidth: "480px", padding: "40px" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Оставить отзыв</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "2rem" }}>{productTitle}</p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Оценка</label>
          <div style={{ display: "flex", gap: "6px", marginTop: "0.5rem" }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}>
                <StarIcon filled={i <= (hover || rating)} />
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Комментарий</label>
          <textarea
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => onSubmit(rating, text)} disabled={rating === 0}
            className="btn-apple" style={{ flex: 1, border: "none", cursor: rating === 0 ? "not-allowed" : "pointer", opacity: rating === 0 ? 0.5 : 1 }}>
            Опубликовать
          </button>
          <button onClick={onClose} className="btn-apple-ghost"
            style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountClient({ user }: { user: User }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user.user_metadata?.full_name || "");
  const [reviewProduct, setReviewProduct] = useState<string | null>(null);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: name } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleReviewSubmit(rating: number, text: string) {
    const supabase = createClient();
    await supabase.from("reviews").insert({
      user_id: user.id,
      product_title: reviewProduct,
      rating,
      text,
    });
    setReviewProduct(null);
    alert("Отзыв отправлен! Спасибо.");
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      {reviewProduct && (
        <ReviewModal
          productTitle={reviewProduct}
          onClose={() => setReviewProduct(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      <section style={{ position: "relative", padding: "90px 24px 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(41,151,255,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "860px", margin: "0 auto" }}>

          {/* Шапка */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="apple-tag anim-1" style={{ marginBottom: "0.75rem" }}>Личный кабинет</p>
              <h1 className="anim-2 gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.05em" }}>
                {name || user.email?.split("@")[0] || "Мой аккаунт"}
              </h1>
              <p className="anim-3" style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "0.4rem" }}>{user.email}</p>
            </div>
            <button onClick={handleLogout} className="btn-apple-ghost anim-3"
              style={{ fontSize: "0.82rem", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)" }}>
              Выйти
            </button>
          </div>

          {/* История заказов */}
          <div className="liquid-glass anim-3" style={{ marginBottom: "16px", overflow: "hidden" }}>
            <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="apple-tag" style={{ marginBottom: "0.4rem" }}>История заказов</p>
              <h2 style={{ fontWeight: 600, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>Мои покупки</h2>
            </div>

            {/* Пустое состояние */}
            <div style={{ padding: "56px 32px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "0.5rem" }}>Покупок пока нет</p>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.82rem", marginBottom: "1.8rem", lineHeight: 1.6 }}>
                После оплаты файлы появятся здесь — вы сможете скачать их в любое время
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/digital" className="btn-apple" style={{ fontSize: "0.85rem" }}>Conclave Digital</Link>
                <Link href="/tech" className="btn-apple-ghost" style={{ fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.15)" }}>Conclave Tech</Link>
              </div>
            </div>

            {/* Пример строки покупки (скрыт, появится с реальными данными) */}
            {/* Когда появятся реальные покупки из БД — рендерить здесь:
            <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Название продукта</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.78rem", marginTop: "0.25rem" }}>12 мая 2026 · 490 ₽</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-apple" style={{ fontSize: "0.78rem", padding: "0.5rem 1.2rem", border: "none", cursor: "pointer" }}>↓ Скачать</button>
                <button onClick={() => setReviewProduct("Название продукта")} className="btn-apple-ghost" style={{ fontSize: "0.78rem", padding: "0.5rem 1.2rem", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>Отзыв</button>
              </div>
            </div> */}
          </div>

          {/* Данные аккаунта */}
          <form onSubmit={handleSave} className="liquid-glass anim-4" style={{ padding: "32px" }}>
            <h2 style={{ fontWeight: 600, fontSize: "1.05rem", letterSpacing: "-0.03em", marginBottom: "1.8rem" }}>Данные аккаунта</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={labelStyle}>Имя</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={user.email || ""} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button type="submit" disabled={saving} className="btn-apple-ghost"
                  style={{ cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Сохраняем..." : "Сохранить"}
                </button>
                {saved && <span style={{ fontSize: "0.82rem", color: "var(--accent-green)" }}>✓ Сохранено</span>}
              </div>
            </div>
          </form>

        </div>
      </section>

      <Footer />
    </main>
  );
}
