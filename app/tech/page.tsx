import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TechClient from "./TechClient";
import { createClient } from "@/lib/supabase/server";

type Service = {
  id: number;
  title: string;
  description: string;
  price_label: string;
  tag: string;
  color: string;
};

const FALLBACK: Service[] = [
  { id: 1, title: "Сайт под ключ", description: "Корпоративный сайт или лендинг. Дизайн, вёрстка, хостинг — без вашего участия.", price_label: "от 15 000 ₽", tag: "Разработка", color: "#2997ff" },
  { id: 2, title: "Telegram-бот", description: "Бот для бизнеса: автоответы, каталог, оплата, уведомления.", price_label: "от 8 000 ₽", tag: "Автоматизация", color: "#30d158" },
  { id: 3, title: "AI-интеграция", description: "Внедрение нейросети в ваш бизнес: чат-бот, генерация контента, анализ данных.", price_label: "от 12 000 ₽", tag: "AI", color: "#bf5af2" },
  { id: 4, title: "Промт-инжиниринг", description: "Системные промты под ваши задачи и обучение команды работе с AI.", price_label: "от 5 000 ₽", tag: "AI", color: "#ff9f0a" },
];

export default async function TechPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("is_active", true).order("id");
  const items: Service[] = (data && data.length > 0) ? data : FALLBACK;

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1 }}>
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

        <TechClient items={items} />
      </div>

      <Footer />
    </main>
  );
}
