import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const IconBolt = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
  </svg>
);

const IconCode = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

export default function Home() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "130px 24px 150px", textAlign: "center", overflow: "hidden" }}>

        {/* Орбы */}
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "1000px", height: "700px", background: "radial-gradient(ellipse, rgba(41,151,255,0.2) 0%, rgba(41,151,255,0.04) 45%, transparent 70%)", animation: "pulse-glow 7s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "500px", height: "500px", background: "radial-gradient(ellipse, rgba(48,209,88,0.1) 0%, transparent 65%)", animation: "float-slow 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "25%", right: "5%", width: "450px", height: "450px", background: "radial-gradient(ellipse, rgba(191,90,242,0.08) 0%, transparent 65%)", animation: "float-slow 11s ease-in-out infinite reverse", pointerEvents: "none" }} />

        {/* Сетка */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "820px", margin: "0 auto" }}>
          <div className="anim-1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(41,151,255,0.1)", border: "1px solid rgba(41,151,255,0.25)", borderRadius: "980px", padding: "6px 16px", marginBottom: "2rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse-glow 2s infinite" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", color: "var(--accent)", textTransform: "uppercase" }}>General Conclave Industries</span>
          </div>

          <h1 className="anim-2" style={{ fontSize: "clamp(3.2rem, 9.5vw, 7.5rem)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.0, marginBottom: "1.5rem" }}>
            <span className="gradient-text">Технологии.</span><br />
            <span className="shimmer-text">Продукты.</span><br />
            <span className="gradient-text-blue">Результат.</span>
          </h1>

          <p className="anim-3" style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.75, letterSpacing: "-0.01em" }}>
            Готовые AI-инструменты и разработка под ключ — всё что нужно для вашего бизнеса.
          </p>

          <div className="anim-4" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/digital" className="btn-apple" style={{ fontSize: "1rem", padding: "0.9rem 2.2rem" }}>Смотреть продукты</Link>
            <Link href="/tech" className="btn-apple-ghost" style={{ fontSize: "1rem", padding: "0.9rem 2.2rem" }}>Заказать разработку</Link>
          </div>
        </div>
      </section>

      {/* ── ДВА ОТДЕЛА ── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>

          <Link href="/digital" className="liquid-glass anim-4" style={{ padding: "48px", display: "block", textDecoration: "none" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #2997ff, #0071e3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.8rem", boxShadow: "0 8px 24px rgba(41,151,255,0.4)", color: "#fff" }}>
              <IconBolt />
            </div>
            <p className="apple-tag" style={{ marginBottom: "0.75rem" }}>Conclave Digital</p>
            <h2 className="gradient-text" style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
              Цифровые<br />продукты
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "2rem" }}>
              Шаблоны промтов, AI-инструменты и IT-продукты. Мгновенное скачивание после оплаты.
            </p>
            <span style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 500 }}>Открыть каталог →</span>
          </Link>

          <Link href="/tech" className="liquid-glass anim-5" style={{ padding: "48px", display: "block", textDecoration: "none" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #30d158, #25a244)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.8rem", boxShadow: "0 8px 24px rgba(48,209,88,0.35)", color: "#fff" }}>
              <IconCode />
            </div>
            <p className="apple-tag" style={{ marginBottom: "0.75rem", color: "var(--accent-green)" }}>Conclave Tech</p>
            <h2 className="gradient-text" style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
              Разработка<br />под ключ
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "2rem" }}>
              Сайты, приложения, Telegram-боты и AI-решения. Оставьте заявку — обсудим детали.
            </p>
            <span style={{ color: "var(--accent-green)", fontSize: "0.9rem", fontWeight: 500 }}>Оставить заявку →</span>
          </Link>
        </div>
      </section>

      {/* ── КАК РАБОТАЕТ ── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div className="liquid-glass-dark" style={{ padding: "72px 56px" }}>
            <p className="apple-tag" style={{ textAlign: "center", marginBottom: "1rem" }}>Процесс</p>
            <h2 className="gradient-text" style={{ fontSize: "2.6rem", fontWeight: 700, letterSpacing: "-0.04em", textAlign: "center", marginBottom: "4rem" }}>Просто и прозрачно</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "56px" }}>
              {[
                { num: "01", title: "Выбираете", text: "Карточка с описанием, галереей и ценой. Никаких скрытых условий." },
                { num: "02", title: "Уточняете", text: "Менеджер в чате ответит и поможет с выбором." },
                { num: "03", title: "Получаете", text: "Оплата любой картой. Файл в личном кабинете — мгновенно." },
              ].map((s, i) => (
                <div key={s.num} className="anim" style={{ textAlign: "center", animationDelay: `${0.3 + i * 0.12}s` }}>
                  <p style={{ fontSize: "3rem", fontWeight: 800, color: "rgba(255,255,255,0.05)", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "1rem" }}>{s.num}</p>
                  <h3 style={{ fontWeight: 600, fontSize: "1.1rem", letterSpacing: "-0.02em", marginBottom: "0.6rem" }}>{s.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 24px 130px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(41,151,255,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: "540px", margin: "0 auto" }}>
          <h2 className="gradient-text anim-1" style={{ fontSize: "3.2rem", fontWeight: 700, letterSpacing: "-0.05em", marginBottom: "1rem" }}>Готовы начать?</h2>
          <p className="anim-2" style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Зарегистрируйтесь бесплатно и получите доступ ко всем продуктам.
          </p>
          <Link href="/auth/register" className="btn-apple anim-3" style={{ fontSize: "1rem", padding: "0.95rem 2.5rem" }}>Создать аккаунт бесплатно</Link>
          <p className="anim-4" style={{ marginTop: "1rem", color: "var(--text-tertiary)", fontSize: "0.8rem" }}>
            История заказов, скачивание файлов и отзывы — всё в одном месте
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
