import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import FadeUp from "../components/FadeUp";

const services = [
  { id: 1, title: "Сайт под ключ", desc: "Корпоративный сайт или лендинг. Дизайн, вёрстка, хостинг — без вашего участия.", price: "от 15 000 ₽", tag: "Разработка", color: "#2997ff" },
  { id: 2, title: "Telegram-бот", desc: "Бот для бизнеса: автоответы, каталог, оплата, уведомления.", price: "от 8 000 ₽", tag: "Автоматизация", color: "#30d158" },
  { id: 3, title: "AI-интеграция", desc: "Внедрение нейросети в ваш бизнес: чат-бот, генерация контента, анализ данных.", price: "от 12 000 ₽", tag: "AI", color: "#bf5af2" },
  { id: 4, title: "Промт-инжиниринг", desc: "Системные промты под ваши задачи и обучение команды работе с AI.", price: "от 5 000 ₽", tag: "AI", color: "#ff9f0a" },
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#ff9f0a" : "none"} stroke="#ff9f0a" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function TechPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", padding: "100px 24px 80px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse, rgba(48,209,88,0.15) 0%, transparent 65%)", animation: "pulse-glow 7s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <p className="apple-tag anim-1" style={{ marginBottom: "1.2rem", color: "var(--accent-green)" }}>Conclave Tech</p>
          <h1 className="anim-2 gradient-text" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.0, marginBottom: "1.2rem" }}>
            Разработка<br />под ключ
          </h1>
          <p className="anim-3" style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            Оставьте заявку — менеджер обсудит детали и рассчитает стоимость.
          </p>
        </div>
      </section>

      {/* Услуги */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {services.map((s, i) => (
            <FadeUp key={s.id} delay={i * 0.12} className="liquid-glass" style={{ padding: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.color }}>{s.tag}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>{s.price}</span>
              </div>
              <div style={{ width: 40, height: 3, borderRadius: 2, background: s.color, marginBottom: "1.5rem", opacity: 0.7 }} />
              <h3 style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>{s.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>{s.desc}</p>
              <Link href="/support" className="btn-apple-ghost" style={{ width: "100%", textAlign: "center", display: "block" }}>Оставить заявку</Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Блок отзывов */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <FadeUp delay={0}>
            <div className="liquid-glass-dark" style={{ padding: "56px 48px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
                <div>
                  <p className="apple-tag" style={{ marginBottom: "0.75rem" }}>Отзывы клиентов</p>
                  <h2 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em" }}>Что говорят клиенты</h2>
                </div>
                <Link href="/support" className="btn-apple-ghost" style={{ fontSize: "0.82rem", border: "1px solid rgba(255,255,255,0.15)" }}>
                  Оставить отзыв
                </Link>
              </div>

              {/* Пустое состояние */}
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "1.2rem" }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} filled={false} />)}
                </div>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  Отзывов пока нет — будьте первым клиентом
                </p>
                <Link href="/support" style={{ color: "var(--accent)", fontSize: "0.85rem", marginTop: "1rem", display: "inline-block" }}>
                  Оставить заявку →
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </main>
  );
}
