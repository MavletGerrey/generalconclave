import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeUp from "../components/FadeUp";
import Link from "next/link";

const products = [
  {
    id: 1, title: "Промт-пак для ChatGPT",
    desc: "50 проверенных промтов для бизнеса, копирайтинга и маркетинга.",
    price: "490 ₽", tag: "Промты", color: "#2997ff", bg: ["#0a2540", "#0071e3"],
    icon: "ChatGPT", count: "50", unit: "промтов",
  },
  {
    id: 2, title: "SEO-промты для контента",
    desc: "Шаблоны для написания SEO-статей с нуля через нейросеть.",
    price: "390 ₽", tag: "Промты", color: "#30d158", bg: ["#0a2e1a", "#25a244"],
    icon: "SEO", count: "30", unit: "шаблонов",
  },
  {
    id: 3, title: "AI-ассистент для продаж",
    desc: "Готовый набор скриптов и промтов для отдела продаж.",
    price: "790 ₽", tag: "Продукт", color: "#bf5af2", bg: ["#1a0a2e", "#9b30d9"],
    icon: "AI", count: "40", unit: "скриптов",
  },
  {
    id: 4, title: "Промты для Midjourney",
    desc: "100 визуальных промтов для генерации профессиональных изображений.",
    price: "590 ₽", tag: "Промты", color: "#ff9f0a", bg: ["#2e1a00", "#c97300"],
    icon: "MJ", count: "100", unit: "промтов",
  },
];

function ProductCover({ p }: { p: typeof products[0] }) {
  return (
    <div style={{
      width: "100%", height: 180, position: "relative", overflow: "hidden",
      background: `linear-gradient(135deg, ${p.bg[0]} 0%, ${p.bg[1]} 100%)`,
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* Фоновые круги */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${p.color}20`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: `${p.color}15`, pointerEvents: "none" }} />

      {/* Контент обложки */}
      <div style={{ position: "absolute", inset: 0, padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Тег */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${p.color}25`, border: `1px solid ${p.color}40`, borderRadius: "980px", padding: "4px 12px", alignSelf: "flex-start" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: p.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.tag}</span>
        </div>

        {/* Большое число + иконка */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: "3.5rem", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em", textShadow: `0 0 40px ${p.color}60` }}>{p.count}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 2 }}>{p.unit}</p>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${p.color}cc, ${p.color}66)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.85rem", color: "#fff",
            boxShadow: `0 8px 24px ${p.color}50`,
            letterSpacing: "-0.02em",
          }}>{p.icon}</div>
        </div>
      </div>
    </div>
  );
}

export default function DigitalPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      <section className="px-6 md:px-12 pt-32 pb-16 text-center relative overflow-hidden">
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(41,151,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p className="apple-tag anim-1 mb-4">Conclave Digital</p>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em" }}
          className="gradient-text anim-2 mb-4">Цифровые продукты</h1>
        <p className="anim-3" style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Скачайте сразу после оплаты. Без ожиданий.
        </p>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", alignItems: "stretch" }}>
          {products.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.12} className="liquid-glass" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <ProductCover p={p} />
              <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.color }}>{p.tag}</span>
                  <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{p.price}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>{p.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem", flex: 1 }}>{p.desc}</p>
                <Link href="/auth/register" className="btn-apple" style={{ width: "100%", textAlign: "center", display: "block" }}>Купить</Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
