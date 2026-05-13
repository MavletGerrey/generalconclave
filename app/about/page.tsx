import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <section style={{ position: "relative", padding: "100px 24px 120px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(255,159,10,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "760px", margin: "0 auto" }}>
          <p className="apple-tag anim-1" style={{ marginBottom: "1.2rem" }}>О компании</p>
          <h1 className="anim-2 gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.05, marginBottom: "3rem" }}>
            General Conclave<br />Industries
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="liquid-glass anim-3" style={{ padding: "36px 40px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.8 }}>
                General Conclave Industries — компания в сфере цифровых продуктов и IT-разработки. Мы создаём инструменты, которые экономят время и помогают бизнесу расти.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="liquid-glass anim-4" style={{ padding: "36px 40px" }}>
                <p className="apple-tag" style={{ marginBottom: "1rem" }}>Conclave Digital</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                  Готовые цифровые продукты: шаблоны промтов, AI-инструменты и IT-решения. Скачайте и применяйте сразу.
                </p>
              </div>
              <div className="liquid-glass anim-4" style={{ padding: "36px 40px" }}>
                <p className="apple-tag" style={{ marginBottom: "1rem", color: "var(--accent-green)" }}>Conclave Tech</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                  Разработка под заказ: сайты, Telegram-боты, AI-интеграции. Работаем прозрачно — от заявки до результата.
                </p>
              </div>
            </div>

            <div className="liquid-glass anim-5" style={{ padding: "36px 40px" }}>
              <p className="apple-tag" style={{ marginBottom: "1.5rem", color: "var(--text-tertiary)" }}>Реквизиты</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  ["Организация", "ИП Салихов Абдулгамид Маратович"],
                  ["Сайт", "generalconclave.net"],
                  ["ИНН", "057205884027"],
                  ["ОГРНИП", "325050000029648"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "0.2rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{k}</p>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{ flex: 1 }} />
      <Footer />
    </main>
  );
}
