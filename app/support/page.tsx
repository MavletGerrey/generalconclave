import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  color: "var(--text)",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
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

export default function SupportPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <section style={{ position: "relative", overflow: "hidden", padding: "80px 24px 120px" }}>
        {/* Орб */}
        <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(41,151,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <p className="apple-tag anim-1" style={{ marginBottom: "1.2rem" }}>Поддержка</p>
          <h1 className="anim-2 gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.05, marginBottom: "1rem" }}>
            Свяжитесь<br />с нами
          </h1>
          <p className="anim-3" style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem" }}>
            Опишите вопрос — менеджер ответит в ближайшее время.
          </p>

          <div className="liquid-glass anim-4" style={{ padding: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={labelStyle}>Имя</label>
                <input type="text" placeholder="Иван Иванов" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="your@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Тема</label>
                <select style={{ ...inputStyle, background: "rgba(255,255,255,0.06)" }}>
                  <option style={{ background: "#111" }}>Вопрос по продукту</option>
                  <option style={{ background: "#111" }}>Заявка на разработку</option>
                  <option style={{ background: "#111" }}>Проблема с оплатой</option>
                  <option style={{ background: "#111" }}>Другое</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Сообщение</label>
                <textarea rows={5} placeholder="Опишите ваш вопрос..." style={{ ...inputStyle, resize: "none" }} />
              </div>
              <button className="btn-apple" style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem", border: "none", cursor: "pointer" }}>
                Отправить заявку
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
