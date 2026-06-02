import { useEffect, useState } from "react";

const ROTATING_WORDS = [
  "historien lever vidare",
  "minnen bevaras",
  "släkten samlas",
  "berättelser delas",
  "generationer möts",
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out → byt ord → fade in
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero-section">
        <h1>Family Tree</h1>
        <p>
          Bygg ditt släktträd och upptäck historierna som format din familj
          genom generationer. Utforska människorna, platserna och minnena som
          gjort din släkt unik. Samla bilder, berättelser och relationer på ett
          och samma ställe, och bevara familjens historia för framtida
          generationer på ett enkelt, modernt och interaktivt sätt.
        </p>
      </section>

      <section className="home-features-section">
        <h2>
          {/* "&nbsp" ger blanksteg */}
          En plats där&nbsp;
          <span
            className="rotating-text"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {ROTATING_WORDS[index]}
          </span>
        </h2>

        <div className="home-features-container">
          <div className="home-feature">
            <h3>Bygg ditt träd</h3>
            <p>
              Lägg till familjemedlemmar och relationer enkelt i det interaktiva
              trädet.
            </p>
          </div>
          <div className="home-feature">
            <h3>Säkra historien</h3>
            <p>
              Se till att dina familjehistorier sparas säkert för framtida
              generationer.
            </p>
          </div>
          <div className="home-feature">
            <h3>Dela och upptäck</h3>
            <p>Utforska dina släktband och samarbeta med familjen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
