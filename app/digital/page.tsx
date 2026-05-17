import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeUp from "../components/FadeUp";
import BuyButton from "../components/BuyButton";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Цифровые продукты",
  description: "Готовые промт-пакеты, AI-скрипты и шаблоны сайтов. Скачайте сразу после оплаты.",
  openGraph: {
    title: "Conclave Digital — Цифровые продукты",
    description: "Промты для ChatGPT, Midjourney, скрипты продаж, шаблоны сайтов. Мгновенная доставка после оплаты.",
  },
};

type Product = {
  id: number; title: string; description: string; price: number;
  tag: string; color: string; count: string; unit: string;
  image_url?: string; category?: string;
};

const BG_MAP: Record<string, [string, string]> = {
  "#2997ff": ["#0a2540", "#0071e3"],
  "#30d158": ["#0a2e1a", "#25a244"],
  "#bf5af2": ["#1a0a2e", "#9b30d9"],
  "#ff9f0a": ["#2e1a00", "#c97300"],
  "#ff3b30": ["#2e0a0a", "#c72020"],
  "#5e5ce6": ["#0a0a2e", "#3a38b0"],
  "#64d2ff": ["#001a2e", "#0090cc"],
  "#ffd60a": ["#2e2600", "#c4a800"],
};

function ProductCover({ p }: { p: Product }) {
  if (p.image_url) {
    return (
      <div style={{ width: "100%", height: 200, position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", top: 14, left: 16, display: "inline-flex", alignItems: "center", gap: 6, background: `${p.color}30`, border: `1px solid ${p.color}50`, borderRadius: "980px", padding: "3px 10px", backdropFilter: "blur(8px)" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: p.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.tag}</span>
        </div>
      </div>
    );
  }

  const bg = BG_MAP[p.color] ?? ["#111", "#333"];
  return (
    <div style={{ width: "100%", height: 180, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${bg[0]} 0%, ${bg[1]} 100%)`, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${p.color}20`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${p.color}25`, border: `1px solid ${p.color}40`, borderRadius: "980px", padding: "4px 12px", alignSelf: "flex-start" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: p.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.tag}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: "3.5rem", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em", textShadow: `0 0 40px ${p.color}60` }}>{p.count}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{p.unit}</p>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${p.color}cc, ${p.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "#fff", boxShadow: `0 8px 24px ${p.color}50` }}>
            {p.tag.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DigitalPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("is_active", true).order("id");
  const items: Product[] = data ?? [];

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <section className="px-6 md:px-12 pt-40 pb-16 text-center relative overflow-hidden">
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(41,151,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
          <p className="apple-tag anim-1 mb-4">Conclave Digital</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em" }} className="gradient-text anim-2 mb-4">Цифровые продукты</h1>
          <p className="anim-3" style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Скачайте сразу после оплаты. Без ожиданий.</p>
        </section>

        <section style={{ padding: "2.5rem 20px 6rem" }}>
          {items.length === 0 ? (
            <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center", padding: "60px 24px" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(41,151,255,0.1)", border: "1px solid rgba(41,151,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.8rem" }}>🔜</div>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Каталог пополняется</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7 }}>Скоро здесь появятся промт-пакеты, AI-скрипты и шаблоны сайтов. Следите за обновлениями.</p>
            </div>
          ) : (
            <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "stretch" }}>
              {items.map((p, i) => (
                <FadeUp key={p.id} delay={i * 0.12} className="liquid-glass" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <ProductCover p={p} />
                  <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.color }}>{p.tag}</span>
                      <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{p.price} ₽</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>{p.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem", flex: 1 }}>{p.description}</p>
                    <BuyButton productId={p.id} title={p.title} price={p.price} />
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
