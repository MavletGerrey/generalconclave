"use client";

import { useState } from "react";
import FadeUp from "../components/FadeUp";
import RequestModal from "../components/RequestModal";

type Service = {
  id: number;
  title: string;
  description: string;
  price_label: string;
  tag: string;
  color: string;
};

const RESULTS: Record<string, string> = {
  "AI-интеграция": "Что получаете: AI отвечает клиентам 24/7, обрабатывает заявки, анализирует данные. Срок — 7–14 дней. Поддержка включена.",
  "Telegram-бот": "Что получаете: бот записывает клиентов, отвечает на вопросы, отправляет уведомления. Работает без вашего участия.",
};

const EXTRA: Record<string, boolean> = {
  "Промт-инжиниринг": true,
  "Сайт под ключ": true,
};

const CASES = [
  {
    industry: "Салон красоты",
    title: "Telegram-бот для записи клиентов",
    result: "Бот принимает запись круглосуточно, напоминает о визите, сокращает отмены на 40%.",
    color: "#2997ff",
  },
  {
    industry: "Юридическая компания",
    title: "AI-ответчик на входящие заявки",
    result: "AI отвечает на типовые вопросы, квалифицирует клиента и передаёт юристу только целевые заявки.",
    color: "#30d158",
  },
  {
    industry: "Медицинская клиника",
    title: "Автоматизация первичного приёма",
    result: "Бот собирает симптомы, назначает специалиста, напоминает о приёме. Администратор разгружен на 60%.",
    color: "#bf5af2",
  },
];

export default function TechClient({ items }: { items: Service[] }) {
  const [modalService, setModalService] = useState<string | null>(null);

  const mainServices = items.filter(s => !EXTRA[s.title]);
  const extraServices = items.filter(s => EXTRA[s.title]);

  return (
    <>
      {modalService !== null && (
        <RequestModal service={modalService} onClose={() => setModalService(null)} />
      )}

      {/* Главные услуги */}
      <section style={{ padding: "0 24px 60px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {mainServices.map((s, i) => (
            <FadeUp key={s.id} delay={i * 0.12} className="liquid-glass" style={{ padding: "40px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.color }}>{s.tag}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>{s.price_label}</span>
              </div>
              <div style={{ width: 40, height: 3, borderRadius: 2, background: s.color, marginBottom: "1.5rem", opacity: 0.7 }} />
              <h3 style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>{s.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>{s.description}</p>

              {RESULTS[s.title] && (
                <div style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{RESULTS[s.title]}</p>
                </div>
              )}

              <div style={{ marginTop: "auto" }}>
                <button
                  onClick={() => setModalService(s.title)}
                  className="btn-apple-ghost"
                  style={{ width: "100%", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", marginBottom: "8px" }}
                >
                  Оставить заявку
                </button>
                <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                  Менеджер ответит в течение 2 часов в Telegram
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Дополнительные услуги */}
      {extraServices.length > 0 && (
        <section style={{ padding: "0 24px 80px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <p className="apple-tag" style={{ marginBottom: "1.2rem", textAlign: "center" }}>Дополнительно</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {extraServices.map((s, i) => (
                <FadeUp key={s.id} delay={i * 0.1} className="liquid-glass" style={{ padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.02em", marginBottom: "0.3rem" }}>{s.title}</h4>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>{s.price_label}</p>
                  </div>
                  <button
                    onClick={() => setModalService(s.title)}
                    className="btn-apple-ghost"
                    style={{ border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: "0.8rem", flexShrink: 0 }}
                  >
                    Узнать цену
                  </button>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Примеры работ */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <FadeUp delay={0}>
            <div className="liquid-glass-dark" style={{ padding: "56px 48px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
                <div>
                  <p className="apple-tag" style={{ marginBottom: "0.75rem" }}>Примеры работ</p>
                  <h2 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em" }}>Как это работает на практике</h2>
                </div>
                <button
                  onClick={() => setModalService("Внедрение AI")}
                  className="btn-apple"
                  style={{ border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Хочу так же
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                {CASES.map((c, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
                    <div style={{ display: "inline-block", background: `${c.color}20`, border: `1px solid ${c.color}30`, borderRadius: "980px", padding: "4px 12px", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: c.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{c.industry}</span>
                    </div>
                    <h4 style={{ fontWeight: 600, fontSize: "0.95rem", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>{c.title}</h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.7 }}>{c.result}</p>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: "center", marginTop: "2.5rem", color: "var(--text-tertiary)", fontSize: "0.82rem" }}>
                Это типовые сценарии. Ваш бизнес — ваше решение. Расскажите задачу — предложим подходящий вариант.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
