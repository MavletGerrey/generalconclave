import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "2.5rem 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Верхняя строка */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.02em", marginBottom: "0.3rem", color: "var(--text)" }}>General Conclave Industries</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>Цифровые продукты и IT-разработка</p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="https://t.me/generalconclave"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: "rgba(41,151,255,0.1)", border: "1px solid rgba(41,151,255,0.25)",
                borderRadius: "980px", padding: "7px 16px",
                fontSize: "0.8rem", fontWeight: 500, color: "var(--accent)",
                textDecoration: "none", transition: "all 0.2s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.062 13.62l-2.97-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.94l.3-.001z"/>
              </svg>
              Telegram
            </a>
            <a
              href="mailto:mavletgerreyllc@gmail.com"
              style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "980px", padding: "7px 16px",
                fontSize: "0.8rem", fontWeight: 500, color: "var(--text-secondary)",
                textDecoration: "none", transition: "all 0.2s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </a>
          </div>
        </div>

        {/* Разделитель */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>© 2026 General Conclave Industries · ИП Салихов Абдулгамид</span>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              ["/legal/terms", "Соглашение"],
              ["/legal/license", "Лицензия"],
              ["/legal/privacy", "Конфиденциальность"],
            ].map(([href, label]) => (
              <Link key={href} href={href} style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textDecoration: "none", transition: "color 0.2s" }}
                className="hover:text-white">{label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
